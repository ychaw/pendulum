import { LP, HP, BP, NOTCH, DSPZERO, VALUERES, TWENTYK } from './Constants';

export interface IPreset {
  readonly step?: number;
  readonly name?: string;
  readonly min: number;
  readonly max: number;
  readonly default: number;
  readonly valueLabelFormat?: any;
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
        default: Math.round(Math.random() * Math.PI * 2 * 100) / 100
      },
      thetaSecondLeg: {
        step: 0.01,
        min: 0,
        max: Math.round(Math.PI * 2 * 100) / 100,
        default: Math.round(Math.random() * Math.PI * 2 * 100) / 100
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

    // All values describe time in ms, except s which is a level of volume
    this.envelope = {
      name: 'Envelope',
      a: {
        min: 5,
        max: 2000,
        default: 400
      },
      d: {
        min: 5,
        max: 2000,
        default: 500
      },
      s: {
        min: 5,
        max: VALUERES,
        default: 600
      },
      r: {
        min: 5,
        max: 2000,
        default: 300
      }
    }

    this.filter = {
      name: 'Filter',
      type: {
        options: [LP, HP, BP, NOTCH],
        default: LP
      },
      // Cutoff frequency or the point where the filters effect becomes audible
      frequency: {
        min: 20,
        max: TWENTYK,
        default: 200
      },
      resonance: {
        min: DSPZERO,
        max: VALUERES,
        default: 100
      }
    }

    this.volume = {
      name: 'Volume',
      volume: {
        min: DSPZERO,
        max: VALUERES,
        default: DSPZERO,
        step: 10,
        valueLabelFormat: (value: number) => {
          return value === DSPZERO ? 0 : value / 10
        }
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
