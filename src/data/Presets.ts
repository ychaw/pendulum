export interface IPreset {
  readonly step?: number;
  readonly name?: string;
  readonly min: number;
  readonly max: number;
  readonly default: number;
}

export interface ITypes {
  readonly options: string[];
  readonly default: string;
}

export class Presets {

  readonly visualsOrder: {
    readonly Oscillator: string;
    readonly Envelope: string;
    readonly Filter: string;
    readonly Volume: string;
  };
  readonly pvMemorySettings: {
    readonly drawMode: 'solidLine' | 'fadingLine' | 'dots';
    readonly maxMem: number;
    readonly fadingStart: number;
    readonly strokeWeight: number;
    readonly drawColor: number[];
  };
  readonly pvPendulumSettings: {
    readonly drawColor: number[];
    readonly legWeight: number;
    readonly ankleWidth: number;
  };
  readonly oscillator: {
    readonly name: string;
    readonly thetaFirstLeg: IPreset;
    readonly thetaSecondLeg: IPreset;
    readonly lengthFirstLeg: IPreset;
    readonly lengthSecondLeg: IPreset;
    readonly massFirstAnkle: IPreset;
    readonly massSecondAnkle: IPreset;
    readonly gravitation: IPreset;
  };
  readonly envelope: {
    readonly name: string;
    readonly a: IPreset;
    readonly d: IPreset;
    readonly s: IPreset;
    readonly r: IPreset;
  };
  readonly filter: {
    readonly name: string;
    readonly type: ITypes;
    readonly frequency: IPreset;
    readonly resonance: IPreset;
  };
  readonly volume: {
    readonly name: string;
    readonly volume: IPreset;
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
        step: 0.01,
        min: 0,
        max: Math.round(Math.PI * 2 * 100) / 100,
        default: 3 // Math.round(Math.random() * Math.PI * 2 * 100) / 100
      },
      thetaSecondLeg: {
        step: 0.01,
        min: 0,
        max: Math.round(Math.PI * 2 * 100) / 100,
        default: 3 // Math.round(Math.random() * Math.PI * 2 * 100) / 100
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
        min: 1,
        max: 40,
        default: 10
      },
      massSecondAnkle: {
        min: 1,
        max: 40,
        default: 10
      },
      gravitation: {
        step: 0.1,
        min: 0.1,
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
        max: 100,
        default: 70
      },
      resonance: {
        min: 0,
        max: 100,
        default: 50
      }
    }

    this.volume = {
      name: 'Volume',
      volume: {
        min: 0,
        max: 100,
        default: 0
      }
    };
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