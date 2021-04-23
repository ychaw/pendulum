import {A, D, S, R, LP, HP, BP, NOTCH, TYPE, FREQ, RES, PARAM_SMOOTHING, DSPZERO, VALUERES} from '../data/Constants';
import { Presets } from '../data/Presets';
const Preset = new Presets();

interface AudioNodes {
    oscillator: OscillatorNode;
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

class AudioGraph {
    audioContext: AudioContext;
    audioNodes: AudioNodes;
    envelope: ADSREnvelope;
    envelopeTimerID: any;

    constructor() {
        // create context
        this.audioContext = new AudioContext();
        this.audioNodes = {
            oscillator: this.audioContext.createOscillator(),
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
        // Set oscillator to saw for testing
        this.audioNodes.oscillator.type = 'sawtooth';

        this.initSmoothTransitions();
        this.connectNodes();
        this.envelopeTimerID = window.setInterval(this.loopEnvelope, 10);
        console.log('constructed audio graph');
    }

    connectNodes() {
        const { oscillator, filter, gain, master } = this.audioNodes;
        oscillator.connect(filter);
        filter.connect(gain);
        gain.connect(master);
        master.connect(this.audioContext.destination);
        oscillator.start();
    }

    // All values that ramp somewhere need to be set once
    initSmoothTransitions() {
        this.audioNodes.master.gain.exponentialRampToValueAtTime(Preset.volume.volume.default, this.audioContext.currentTime);
        this.audioNodes.gain.gain.exponentialRampToValueAtTime(1, this.audioContext.currentTime);
        this.audioNodes.filter.frequency.exponentialRampToValueAtTime(Preset.filter.frequency.default, this.audioContext.currentTime);
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
        const lookahead : number = 25; // in ms
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
}

export const audioGraph = new AudioGraph();
