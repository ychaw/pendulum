import {A, D, S, R, LP, HP, BP, NOTCH, TYPE, FREQ, RES, PARAM_SMOOTHING, TWENTYK, DSPZERO, VALUERES} from '../data/Constants';
import { Presets } from '../data/Presets';
import DoublePendulum from '../sim/double-pendulum';
import FFT from 'fft.js';
const Preset = new Presets();

interface AudioNodes {
    oscillator: MorphingOscillator;
    filter: BiquadFilterNode;
    gain: GainNode;
    master: GainNode;
}

type ADSREnvelope = {
    a: number;
    d: number;
    s: number;
    r: number;
    stage: number;
    timings: Array<number>;
}

type EnvelopeSegment = {
    identifier: 'a' | 'd' | 's' | 'r';
    value: number;
}

export type FilterParam = {
    identifier: 'frequency' | 'resonance';
    value: number;
}

export type FilterType = {
    identifier: 'type';
    value: 'lp' | 'hp' | 'bp' | 'notch';
}

type MorphingOscillator = {
    oscillators: Array<OscillatorNode>;
    gainNodes: Array<GainNode>;
    morphStage: number;
    morphDuration: number;
    nextTableIndex: number;
}

export default class AudioGraph {
    audioContext: AudioContext;
    audioNodes: AudioNodes;
    envelope: ADSREnvelope;
    envelopeTimerID: any;
    oscillatorTimerID: any;
    pendulum: DoublePendulum;
    pendulumBuffer: Float64Array;
    fft: FFT;
    activeNotes: Array<number>;
    hasMIDI: boolean;

    constructor(doublePendulum: DoublePendulum) {
        // create context
        this.audioContext = new AudioContext();
        this.audioNodes = {
            oscillator: {
              oscillators: [this.audioContext.createOscillator(), this.audioContext.createOscillator()],
              gainNodes: [this.audioContext.createGain(), this.audioContext.createGain()],
              morphStage: 0.0,
              morphDuration: 2000,
              nextTableIndex: 1,
            },
            filter: this.audioContext.createBiquadFilter(),
            gain: this.audioContext.createGain(),
            master: this.audioContext.createGain(),
        };
        this.envelope = {
            a: Preset.envelope.a.default / 1000,
            d: Preset.envelope.d.default / 1000,
            s: Preset.envelope.s.default / VALUERES,
            r: Preset.envelope.r.default / 1000,
            stage: 0,
            timings: [
                this.audioContext.currentTime,
                this.audioContext.currentTime,
                this.audioContext.currentTime,
            ],
        };
        this.pendulum = doublePendulum;

        this.pendulumBuffer = new Float64Array(1024);
        this.fft = new FFT(this.pendulumBuffer.length);
        this.setOscillatorWave();
        this.audioNodes.oscillator.oscillators[0].frequency.value = 110;
        this.audioNodes.oscillator.oscillators[1].frequency.value = 110;

        this.initSmoothTransitions();
        this.connectNodes();
        //this.envelopeTimerID = window.setInterval(this.loopEnvelope, 10);
        this.oscillatorTimerID = window.setTimeout(this.updateOscillator, 10 );
        this.activeNotes = [];
        this.hasMIDI = false;
        console.log('constructed audio graph');
        this.setupMidi();
    }

    connectNodes() {
        const { filter, gain, master } = this.audioNodes;
        const morphOsc = this.audioNodes.oscillator;
        for(let i = 0; i < morphOsc.oscillators.length; i++) {
          morphOsc.oscillators[i].connect(morphOsc.gainNodes[i]);
          morphOsc.gainNodes[i].connect(filter);
        }
        filter.connect(gain);
        gain.connect(master);
        master.connect(this.audioContext.destination);
        morphOsc.oscillators.forEach(osc => osc.start());
    }

    // All values that ramp somewhere need to be set once
    initSmoothTransitions() {
        this.audioNodes.master.gain.exponentialRampToValueAtTime(Preset.volume.volume.default, this.audioContext.currentTime);
        this.audioNodes.gain.gain.exponentialRampToValueAtTime(DSPZERO, this.audioContext.currentTime);
        this.audioNodes.filter.frequency.exponentialRampToValueAtTime(Preset.filter.frequency.default, this.audioContext.currentTime);
        this.audioNodes.oscillator.gainNodes[0].gain.linearRampToValueAtTime(1, this.audioContext.currentTime);
        this.audioNodes.oscillator.gainNodes[1].gain.linearRampToValueAtTime(DSPZERO, this.audioContext.currentTime);
    }


    setEnvelope(segment: EnvelopeSegment) {
        switch(segment.identifier) {
            case A:
                this.envelope.a = segment.value / 1000;
                break;
            case D:
                this.envelope.d = segment.value / 1000;
                break;
            case S:
                this.envelope.s = segment.value / VALUERES;
                break;
            case R:
                this.envelope.r = segment.value / 1000;
                break;
            default:
                break;
        }
    }

    loopEnvelope = () => {
        const { a, d, s, r } = this.envelope;
        if(this.envelope.timings[this.envelope.stage] <= this.audioContext.currentTime) {
            switch (this.envelope.stage) {
                case 0:
                    this.envelope.timings[1] = this.audioContext.currentTime + a;
                    this.audioNodes.gain.gain.exponentialRampToValueAtTime(1, this.envelope.timings[1]);
                    this.envelope.stage = 1;
                    break;
                case 1:
                    this.envelope.timings[2] = this.audioContext.currentTime + d;
                    this.audioNodes.gain.gain.exponentialRampToValueAtTime(s, this.envelope.timings[2]);
                    this.envelope.stage = 2;
                    break;
                case 2:
                    this.envelope.timings[0] = this.audioContext.currentTime + r;
                    this.audioNodes.gain.gain.exponentialRampToValueAtTime(DSPZERO, this.envelope.timings[0]);
                    this.envelope.stage = 0;
                    break;
                default:
                    this.envelope.stage = 0;
                    break;
            }
        }
    }

    setFilter(param: FilterParam | FilterType) {
        switch(param.identifier) {
            case TYPE:
                const valid = [LP, HP, BP, NOTCH].includes(param.value);
                if(valid) {
                    switch(param.value) {
                        case LP:
                            this.audioNodes.filter.type = 'lowpass';
                            break;
                        case HP:
                            this.audioNodes.filter.type = 'highpass';
                            break;
                        case BP:
                            this.audioNodes.filter.type = 'bandpass';
                            break;
                        case NOTCH:
                            this.audioNodes.filter.type = 'notch';
                            break;
                    }
                }
                break;
            case FREQ:
                this.audioNodes.filter.frequency.exponentialRampToValueAtTime(param.value, this.audioContext.currentTime + PARAM_SMOOTHING);
                break;
            case RES:
                this.audioNodes.filter.Q.exponentialRampToValueAtTime(param.value, this.audioContext.currentTime + PARAM_SMOOTHING);
                break;
            default:
                break;
        }

    }

    setMasterGain(value: number) {
        const val = this.keepValuePositive(value / VALUERES);
        this.audioNodes.master.gain.exponentialRampToValueAtTime(val, this.audioContext.currentTime + PARAM_SMOOTHING);
    }

    keepValuePositive(value: number) {
        if (value < DSPZERO) value = DSPZERO;
        return value;
    }

    fillBuffer(buffer: Float64Array, pendulum: DoublePendulum): void {
        const initialState = pendulum.getPendulumState();
        let lastState = {
          ...initialState,
          // JS apparently copies arrays nested in objects by reference, so we need manual copies for these:
          theta: Array.from(initialState.theta),
          dTheta: Array.from(initialState.dTheta),
          ddTheta: Array.from(initialState.ddTheta),
        };
        // rect window
        const window = Array(buffer.length).fill(1);

        if (true) {
            // make window a parzen window
            const w = (n: number) => Math.abs(n) <= buffer.length/4 ?
                1 - 6 * Math.pow(n/(buffer.length/2), 2) * (1 - Math.abs(n)/(buffer.length/2)) :
                2 * Math.pow(1 - (Math.abs(n)/(buffer.length/2)), 3);
            for (let i = 0; i < buffer.length; i++) {
                window[i] = w(i - buffer.length / 2);
            }
        }
        // fill the buffer with data 'from the future' and undersample
        for(let index = 0; index < buffer.length; index += 4) {
            const x = lastState.l[0] * Math.sin(lastState.theta[0]);
            // use x[1] as value
            buffer[index] = (x + lastState.l[1] * Math.sin(lastState.theta[1])) * window[index];
            // use theta as value
            //buffer[index] = lastState.theta[0] * window[index];
            lastState = pendulum.advanceState(lastState);
        }
    }

    setOscillatorWave(): void {
        this.fillBuffer(this.pendulumBuffer, this.pendulum);
        // fourier transform the buffer contents
        const out = this.fft.createComplexArray();
        this.fft.realTransform(out, this.pendulumBuffer);

        // split real and imaginary parts
        const real = new Float32Array(this.pendulumBuffer.length);
        const imag = new Float32Array(this.pendulumBuffer.length);

        for(let i = 0; i < real.length; i++) {
            real[i] = out[i * 2];
            imag[i] = out[1 + i * 2];
        }

        // build a wave from real and imaginary parts
        const wave = this.audioContext.createPeriodicWave(real, imag);
        this.audioNodes.oscillator.oscillators[this.audioNodes.oscillator.nextTableIndex].setPeriodicWave(wave);
        this.audioNodes.oscillator.nextTableIndex = (this.audioNodes.oscillator.nextTableIndex + 1) % this.audioNodes.oscillator.oscillators.length;
    }

    updateOscillator = () => {
      //this.audioNodes.oscillator.gainNodes[0].gain.cancelScheduledValues(this.audioContext.currentTime);
      //this.audioNodes.oscillator.gainNodes[1].gain.cancelScheduledValues(this.audioContext.currentTime);
        window.clearTimeout(this.oscillatorTimerID);


        const morphDiv = 1;
      if (this.audioNodes.oscillator.nextTableIndex === 0) {
          this.audioNodes.oscillator.gainNodes[0].gain.linearRampToValueAtTime(1, this.audioContext.currentTime + this.audioNodes.oscillator.morphDuration / 1000 / morphDiv);
          this.audioNodes.oscillator.gainNodes[1].gain.linearRampToValueAtTime(DSPZERO, this.audioContext.currentTime + this.audioNodes.oscillator.morphDuration / 1000 / morphDiv);
      } else if (this.audioNodes.oscillator.nextTableIndex === 1) {
          this.audioNodes.oscillator.gainNodes[0].gain.linearRampToValueAtTime(DSPZERO, this.audioContext.currentTime + this.audioNodes.oscillator.morphDuration / 1000 / morphDiv);
          this.audioNodes.oscillator.gainNodes[1].gain.linearRampToValueAtTime(1, this.audioContext.currentTime + this.audioNodes.oscillator.morphDuration / 1000 / morphDiv);
      }
        this.oscillatorTimerID = window.setTimeout(this.updateOscillator, this.audioNodes.oscillator.morphDuration);

      this.setOscillatorWave();
    };

    /**
      * @param res - How many frequencies will be sampled
      * @returns Float32Array with values between 0 - 1 that represent the magnitude of the sampled frequencies
      */
    getFilterSpectrum(res: number): Float32Array {
      // Which frequencies to sample
      const freq = new Float32Array(res);
      // Output arrays for magnitudes and phases
      const magOut = new Float32Array(res);
      const phaOut = new Float32Array(res);
      // Distance between frequencies
      const fStep = TWENTYK / res;

      for (let i = 0; i < res; i++) {
        freq[i] = i * fStep;
      }

      this.audioNodes.filter.getFrequencyResponse(freq, magOut, phaOut);
      return magOut;
    }

    setupMidi(): void {
        let midiAccess;
        const portamento = 0.001;
        // functions
        const onMIDIInit = (midi: any) => {
            midiAccess = midi;
            let foundDevice = false;
            let inputs = midiAccess.inputs.values();
            for ( let input = inputs.next(); input && !input.done; input = inputs.next()) {
                input.value.onmidimessage = MIDIMessageEventHandler;
                foundDevice = true;
                this.hasMIDI = foundDevice;
            }
            if (!foundDevice) {
                alert('No MIDI device found');
            }

        };
        const onMIDIReject = (err: any) => {
            alert('MIDI system failed to start.');
        };
        const MIDIMessageEventHandler = (event: any) => {
            switch (event.data[0] & 0xf0) {
                case 0x80:
                    noteOff(event.data[1]);
                    return;
                case 0x90:
                    if (event.data[2] !== 0) {
                        noteOn(event.data[1]);
                        return;
                    }
            }
        };
        const frequencyFromNoteNumber = ( note: number ) => 440 * Math.pow(2, (note-69)/12);
        const noteOn = ( noteNumber: number ) => {
            this.activeNotes.push( noteNumber );
            this.audioNodes.oscillator.oscillators.forEach((osc) => {
                osc.frequency.cancelScheduledValues(0);
                osc.frequency.setTargetAtTime( frequencyFromNoteNumber(noteNumber), 0, portamento );
            });
            this.audioNodes.gain.gain.cancelScheduledValues(0);
            this.audioNodes.gain.gain.setTargetAtTime(1.0, 0, this.envelope.a);
            this.audioNodes.gain.gain.setTargetAtTime(this.envelope.s, this.envelope.a, this.envelope.d);
        };
        const noteOff = (noteNumber: number) => {
            let position = this.activeNotes.indexOf(noteNumber);
            if (position !== -1) {
                this.activeNotes.splice(position, 1);
            }
            if (this.activeNotes.length === 0) {
                this.audioNodes.gain.gain.cancelScheduledValues(0);
                this.audioNodes.gain.gain.setTargetAtTime(0.0, 0, this.envelope.r);
            } else {
                this.audioNodes.oscillator.oscillators.forEach((osc) => {
                    osc.frequency.cancelScheduledValues(0);
                    osc.frequency.setTargetAtTime(frequencyFromNoteNumber(this.activeNotes[this.activeNotes.length - 1]), 0, portamento);
                });
            }
        };
        console.log('Trying to access MIDI devices...')
        // @ts-ignore
        if (navigator.requestMIDIAccess) {
            // @ts-ignore
            navigator.requestMIDIAccess().then( onMIDIInit, onMIDIReject);
            console.log('Connected to MIDI device')
        }
    }
}
