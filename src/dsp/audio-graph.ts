interface AudioNodes {
    oscillator: OscillatorNode;
    filter: BiquadFilterNode;
    gain: GainNode;
    master: GainNode;
}

class AudioGraph {
    audioContext: AudioContext;
    audioNodes: AudioNodes;

    constructor() {
        // create context
        this.audioContext = new AudioContext();
        this.audioNodes = {
            oscillator: this.audioContext.createOscillator(),
            filter: this.audioContext.createBiquadFilter(),
            gain: this.audioContext.createGain(),
            master: this.audioContext.createGain(),
        };
        this.connectNodes();
        console.log('constructed audio graph');
    }

    connectNodes() {
        const { oscillator, filter, gain, master } = this.audioNodes;
        oscillator.connect(filter);
        filter.connect(gain);
        gain.connect(master);
        master.connect(this.audioContext.destination);
        oscillator.start();
        this.audioNodes.master.gain.setValueAtTime(0, this.audioContext.currentTime);
    }

    setGain(value: number) {
        const val = value / 100;
        this.audioNodes.master.gain.setValueAtTime(val, this.audioContext.currentTime);
    }
}

export const audioGraph = new AudioGraph();