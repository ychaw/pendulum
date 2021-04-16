interface IPreset {
  min: number;
  max: number;
  default: number;
}

export class Presets {

  readonly visualsOrder: {
    Oscillator: string;
    Envelope: string;
    Filter: string;
    Volume: string;
  };
  readonly pvMemorySettings: {
    drawMode: 'solidLine' | 'fadingLine' | 'dots';
    maxMem: number;
    fadingStart: number;
    strokeWeight: number;
    drawColor: number[];
  };
  readonly pvPendulumSettings: {
    drawColor: number[];
    legWeight: number;
    ankleWidth: number;
  };
  oscillator: {
    name: string;
    thetaFirstLeg: IPreset;
    thetaSecondLeg: IPreset;
    lengthFirstLeg: IPreset;
    lengthSecondLeg: IPreset;
    massFirstAnkle: IPreset;
    massSecondAnkle: IPreset;
    gravitation: IPreset;
  };
  envelope: {
    name: string;
    a: IPreset;
    d: IPreset;
    s: IPreset;
    r: IPreset;
  };
  filter: {
    name: string;
    type: { options: string[]; default: string; };
    frequency: IPreset;
  };
  volume: {
    name: string;
    volume: IPreset;
  };

  constructor() {

    this.visualsOrder = {
      'Oscillator': 'FocusCard',
      'Envelope': 'DetailTopCard',
      'Filter': 'DetailCenterCard',
      'Volume': 'DetailBottomCard',
    }

    this.pvMemorySettings = {
      drawMode: 'fadingLine',
      maxMem: 400,
      fadingStart: 150,
      strokeWeight: 1,
      drawColor: [200, 200, 200]
    }

    this.pvPendulumSettings = {
      drawColor: [255, 255, 255],
      legWeight: 4,
      ankleWidth: 10
    }

    this.oscillator = {
      name: 'Oscillator',
      thetaFirstLeg: {
        min: 0,
        max: Math.PI * 2,
        default: Math.random() * Math.PI * 2
      },
      thetaSecondLeg: {
        min: 0,
        max: Math.PI * 2,
        default: Math.random() * Math.PI * 2
      },
      lengthFirstLeg: {
        min: 10,
        max: 160,
        default: 160
      },
      lengthSecondLeg: {
        min: 10,
        max: 160,
        default: 160
      },
      massFirstAnkle: {
        min: 0,
        max: 100,
        default: 10
      },
      massSecondAnkle: {
        min: 0,
        max: 100,
        default: 10
      },
      gravitation: {
        min: 0,
        max: 2,
        default: 0.8
      },
    }

    // big questions here... ;)
    this.envelope = {
      name: 'Envelope',
      a: {
        min: 0,
        max: 100,
        default: 20
      },
      d: {
        min: 0,
        max: 100,
        default: 40
      },
      s: {
        min: 0,
        max: 100,
        default: 30
      },
      r: {
        min: 0,
        max: 100,
        default: 60
      }
    }

    // ...and even bigger ones here
    this.filter = {
      name: 'Filter',
      type: {
        options: ['Low Pass', 'High Pass', 'Band Pass', 'Notch'],
        default: 'Low Pass'
      },
      frequency: {
        min: 0,
        max: 0,
        default: 0
      }
    }

    this.volume = {
      name: 'Volume',
      volume: {
        min: 0,
        max: 100,
        default: 50
      }
    }
  }

  getDoublePendulumPresets() {
    return {
      theta: [
        this.oscillator.thetaFirstLeg.default,
        this.oscillator.thetaSecondLeg.default,
      ],
      l: [
        this.oscillator.lengthFirstLeg.default,
        this.oscillator.lengthSecondLeg.default,
      ],
      m: [
        this.oscillator.massFirstAnkle.default,
        this.oscillator.massSecondAnkle.default,
      ],
      g: this.oscillator.gravitation.default,
    }
  }

  getComponentByName(name: string) {
    if (name === this.oscillator.name) {
      return this.oscillator
    } else if (name === this.envelope.name) {
      return this.envelope
    } else if (name === this.filter.name) {
      return this.filter
    } else if (name === this.volume.name) {
      return this.volume
    }
  }

  getComponentNames() {
    return [this.oscillator.name, this.envelope.name, this.filter.name, this.volume.name]
  }

}