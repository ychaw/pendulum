// TYPE DECLARATIONS
interface InitialConditions {
  theta: Array<number>;
  l: Array<number>;
  m: Array<number>;
  g: number;
}

interface Memory {
  massSum: number;
  biasedMassSum: number;
  angleDifference: number;
  doubleSineAngleDiff: number;
  cosAngleDiff: number;
  denFactor: number;
  velSquaredTimesL: Array<number>;
}

export class DoublePendulum {
  // TYPES
  x: Array<number>;
  y: Array<number>;
  theta: Array<number>;
  dTheta: Array<number>;
  ddTheta: Array<number>;
  l: Array<number>;
  m: Array<number>;
  g: number;
  mem: Memory;

  constructor(init: InitialConditions) {
    const defaults = {
      theta: [
        Math.PI / 4,
        Math.PI / 4,
      ],
      l: [120, 70],
      m: [10, 10],
      g: 1,
    };
    const initialConditions = {
      ...defaults,
      ...init
    }
    this.x = [0, 0];
    this.y = [0, 0];
    this.theta = initialConditions.theta;
    this.dTheta = [0, 0];
    this.ddTheta = [0, 0];
    this.l = initialConditions.l;
    this.m = initialConditions.m;
    this.g = initialConditions.g;

    // object to store repeated calculations in
    this.mem = {
      massSum: 0,
      biasedMassSum: 0,
      angleDifference: 0,
      doubleSineAngleDiff: 0,
      cosAngleDiff: 0,
      denFactor: 0,
      velSquaredTimesL: [0, 0],
    };
  }

  resetPhysics() {
    if (this.ddTheta[0] !== 0) {
      this.mem.massSum = 0;
      this.mem.biasedMassSum = 0;
      this.mem.angleDifference = 0;
      this.mem.doubleSineAngleDiff = 0;
      this.mem.cosAngleDiff = 0;
      this.mem.denFactor = 0;
      this.mem.velSquaredTimesL = [0, 0];
      this.dTheta = [0, 0];
      this.ddTheta = [0, 0];
    }
  }

  setValue(param: string, newValue: number) {
    switch (param) {
      case 'thetaFirstLeg':
        this.theta[0] = newValue;
        this.resetPhysics();
        break;
      case 'thetaSecondLeg':
        this.theta[1] = newValue;
        this.resetPhysics();
        break;
      case 'lengthFirstLeg':
        this.l[0] = newValue;
        break;
      case 'lengthSecondLeg':
        this.l[1] = newValue;
        break;
      case 'massFirstAnkle':
        this.m[0] = newValue;
        break;
      case 'massSecondAnkle':
        this.m[1] = newValue;
        break;
      case 'gravitation':
        this.g = newValue;
        break;
    }
  }

  recalcPositions() {
    const { sin, cos } = Math;
    const { x, y, theta, l } = this;
    // calculate the new bob positions
    x[0] = l[0] * sin(theta[0]);
    y[0] = l[0] * cos(theta[0]);
    x[1] = x[0] + l[1] * sin(theta[1]);
    y[1] = y[0] + l[1] * cos(theta[1]);
  }

  tick() {
    const { sin, cos } = Math;
    const { x, y, theta, dTheta, ddTheta, l, m, g, mem } = this;

    // extract repeated calculations
    mem.massSum = m[0] + m[1];
    mem.biasedMassSum = 2 * m[0] + m[1];
    mem.angleDifference = theta[0] - theta[1];
    mem.doubleSineAngleDiff = 2 * sin(mem.angleDifference);
    mem.cosAngleDiff = cos(mem.angleDifference);
    mem.denFactor = mem.biasedMassSum - m[1] * cos(2 * mem.angleDifference);
    mem.velSquaredTimesL = [
      dTheta[0] * dTheta[0] * l[0],
      dTheta[1] * dTheta[1] * l[1]
    ];

    const {
      massSum,
      biasedMassSum,
      doubleSineAngleDiff,
      cosAngleDiff,
      denFactor,
      velSquaredTimesL,
    } = mem;

    // solve for the second derivatives
    // the equations are very long fractions, that's why they were split like this
    const num = [0, 0, 0, 0];
    const den = [
      l[0] * denFactor,
      l[1] * denFactor
    ];

    // for theta 1
    num[0] = -g * biasedMassSum * sin(theta[0]);
    num[1] = -m[1] * g * sin(theta[0] - 2 * theta[1]);
    num[2] = -doubleSineAngleDiff * m[1]
    num[3] = velSquaredTimesL[1] + velSquaredTimesL[0] * cosAngleDiff;
    ddTheta[0] = (num[0] + num[1] + num[2] * num[3]) / den[0];

    // for theta 2
    num[0] = doubleSineAngleDiff;
    num[1] = velSquaredTimesL[0] * massSum;
    num[2] = g * massSum * cos(theta[0]);
    num[3] = velSquaredTimesL[1] * m[1] * cosAngleDiff;
    ddTheta[1] = (num[0] * (num[1] + num[2] + num[3])) / den[1];

    // calculate the new bob positions
    x[0] = l[0] * sin(theta[0]);
    y[0] = l[0] * cos(theta[0]);

    x[1] = x[0] + l[1] * sin(theta[1]);
    y[1] = y[0] + l[1] * cos(theta[1]);

    // simulate physics for theta 1 and 2
    for (let i = 0; i < 2; i++) {
      dTheta[i] += ddTheta[i];
      theta[i] += dTheta[i];

      theta[i] %= (2 * Math.PI);
      if (theta[i] < 0) {
        theta[i] += 2 * Math.PI;
      }

      // Optional dampening function
      // dTheta[i] *= 0.9975
    }
  }
}
