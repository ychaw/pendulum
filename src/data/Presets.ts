interface IPreset {
  readonly min: number
  readonly max: number
  readonly default: number | string
  readonly options?: Array<string>
}

interface IComponent {
  readonly thetaFirstLeg?: Preset
  readonly thetaSecondLeg?: Preset
  readonly lengthFirstLeg?: Preset
  readonly lengthSecondLeg?: Preset
  readonly massFirstAnkle?: Preset
  readonly massSecondAnkle?: Preset
  readonly gravitation?: Preset
  readonly a?: Preset
  readonly d?: Preset
  readonly s?: Preset
  readonly r?: Preset
  readonly type?: Preset
  readonly frequency?: Preset
  readonly volume?: Preset
}

class Preset {
  readonly min: number
  readonly max: number
  readonly default: number | string
  readonly options?: Array<string>

  constructor(init: IPreset) {
    this.min = init.min;
    this.max = init.max;
    this.default = init.default;
    this.options = init.options;
  }
}

class Component {
  readonly name: string
  readonly thetaFirstLeg?: Preset
  readonly thetaSecondLeg?: Preset
  readonly lengthFirstLeg?: Preset
  readonly lengthSecondLeg?: Preset
  readonly massFirstAnkle?: Preset
  readonly massSecondAnkle?: Preset
  readonly gravitation?: Preset
  readonly a?: Preset
  readonly d?: Preset
  readonly s?: Preset
  readonly r?: Preset
  readonly type?: Preset
  readonly frequency?: Preset
  readonly volume?: Preset

  constructor(name: string, init: IComponent) {
    this.name = name;
    this.thetaFirstLeg = init.thetaFirstLeg;
    this.thetaSecondLeg = init.thetaSecondLeg;
    this.lengthFirstLeg = init.lengthFirstLeg;
    this.lengthSecondLeg = init.lengthSecondLeg;
    this.massFirstAnkle = init.massFirstAnkle;
    this.massSecondAnkle = init.massSecondAnkle;
    this.gravitation = init.gravitation;
    this.a = init.a;
    this.d = init.d;
    this.s = init.s;
    this.r = init.r;
    this.type = init.type;
    this.frequency = init.frequency;
    this.volume = init.volume;
  }
}


export class Presets {

  readonly oscillator: Component;
  readonly envelope: Component;
  readonly filter: Component;
  readonly volume: Component;

  constructor() {

    this.oscillator = new Component('Oscillator', {
      thetaFirstLeg: new Preset({
        min: 0,
        max: Math.PI * 2,
        default: Math.random() * Math.PI * 2
      }),
      thetaSecondLeg: new Preset({
        min: 0,
        max: Math.PI * 2,
        default: Math.random() * Math.PI * 2
      }),
      lengthFirstLeg: new Preset({
        min: 10,
        max: 160,
        default: 160
      }),
      lengthSecondLeg: new Preset({
        min: 10,
        max: 160,
        default: 160
      }),
      massFirstAnkle: new Preset({
        min: 0,
        max: 100,
        default: 10
      }),
      massSecondAnkle: new Preset({
        min: 0,
        max: 100,
        default: 10
      }),
      gravitation: new Preset({
        min: 0,
        max: 2,
        default: 0.8
      }),
    });

    // big questions here... ;)
    this.envelope = new Component('Envelope', {
      a: new Preset({
        min: 0,
        max: 100,
        default: 50
      }),
      d: new Preset({
        min: 0,
        max: 100,
        default: 50
      }),
      s: new Preset({
        min: 0,
        max: 100,
        default: 50
      }),
      r: new Preset({
        min: 0,
        max: 100,
        default: 50
      })
    });

    // ...and even bigger ones here
    this.filter = new Component('Filter', {
      type: new Preset({
        min: 0,
        max: 0,
        options: ['Low Pass', 'High Pass', 'Band Pass', 'Notch'],
        default: 'Low Pass'
      }),
      frequency: new Preset({
        min: 0,
        max: 0,
        default: 0
      })
    });

    this.volume = new Component('Volume', {
      volume: new Preset({
        min: 0,
        max: 100,
        default: 0
      })
    });
  }

  getDoublePendulumPresets() {
    return {
      theta: [
        this.oscillator.thetaFirstLeg?.default as number,
        this.oscillator.thetaSecondLeg?.default as number,
      ],
      l: [
        this.oscillator.lengthFirstLeg?.default as number,
        this.oscillator.lengthSecondLeg?.default as number,
      ],
      m: [
        this.oscillator.massFirstAnkle?.default as number,
        this.oscillator.massSecondAnkle?.default as number,
      ],
      g: this.oscillator.gravitation?.default as number,
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