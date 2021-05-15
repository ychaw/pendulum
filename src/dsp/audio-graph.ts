import {A, D, S, R, LP, HP, BP, NOTCH, TYPE, FREQ, RES, PARAM_SMOOTHING, DSPZERO, VALUERES} from '../data/Constants';
import { Presets } from '../data/Presets';
import { DoublePendulum, DoublePendulumSingleton } from '../sim/double-pendulum';
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

type FilterParam = {
    identifier: 'frequency' | 'resonance';
    value: number;
}

type FilterType = {
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

class AudioGraph {
    audioContext: AudioContext;
    audioNodes: AudioNodes;
    envelope: ADSREnvelope;
    envelopeTimerID: any;
    oscillatorTimerID: any;
    pendulum: DoublePendulum;
    pendulumBuffer: Float64Array;
    fft: FFT;

    constructor() {
        // create context
        this.audioContext = new AudioContext();
        this.audioNodes = {
            oscillator: {
              oscillators: [this.audioContext.createOscillator(), this.audioContext.createOscillator()],
              gainNodes: [this.audioContext.createGain(), this.audioContext.createGain()],
              morphStage: 0.0,
              morphDuration: 1000,
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
        this.pendulum = DoublePendulumSingleton;

        this.pendulumBuffer = new Float64Array(1024);
        this.fft = new FFT(this.pendulumBuffer.length);
        // Set oscillator to saw for testing
        this.setOscillatorWave();

        this.initSmoothTransitions();
        this.connectNodes();
        //this.envelopeTimerID = window.setInterval(this.loopEnvelope, 10);
        this.oscillatorTimerID = window.setInterval(this.updateOscillator, this.audioNodes.oscillator.morphDuration );
        console.log('constructed audio graph');
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
        this.audioNodes.gain.gain.exponentialRampToValueAtTime(1, this.audioContext.currentTime);
        this.audioNodes.filter.frequency.exponentialRampToValueAtTime(Preset.filter.frequency.default, this.audioContext.currentTime);
        this.audioNodes.oscillator.gainNodes[0].gain.exponentialRampToValueAtTime(1, this.audioContext.currentTime);
        this.audioNodes.oscillator.gainNodes[1].gain.exponentialRampToValueAtTime(DSPZERO, this.audioContext.currentTime);
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
        // fill the buffer with data 'from the future'
        for(let index = 0; index < buffer.length; index++) {
            const x = lastState.l[0] * Math.sin(lastState.theta[0]);
            // use x[1] as value
            buffer[index] = x + lastState.l[1] * Math.sin(lastState.theta[1]);
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

      const morphDiv = 2;
      if (this.audioNodes.oscillator.nextTableIndex === 0) {
        this.audioNodes.oscillator.gainNodes[0].gain.linearRampToValueAtTime(1, this.audioContext.currentTime + this.audioNodes.oscillator.morphDuration / morphDiv);
        this.audioNodes.oscillator.gainNodes[1].gain.linearRampToValueAtTime(DSPZERO, this.audioContext.currentTime + this.audioNodes.oscillator.morphDuration / morphDiv);

      } else if (this.audioNodes.oscillator.nextTableIndex === 1) {
        this.audioNodes.oscillator.gainNodes[0].gain.linearRampToValueAtTime(DSPZERO, this.audioContext.currentTime + this.audioNodes.oscillator.morphDuration / morphDiv);
        this.audioNodes.oscillator.gainNodes[1].gain.linearRampToValueAtTime(1, this.audioContext.currentTime + this.audioNodes.oscillator.morphDuration / morphDiv);
      }

      this.setOscillatorWave();
    };
}

export const audioGraph = new AudioGraph();
