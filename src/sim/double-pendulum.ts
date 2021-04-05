class DoublePendulum {
  // TYPES
  p: array;
  g: number;
  mem: Memory;
  
  interface Memory {
      massSum: number;
      biasedMassSum: number;
      angleDifference: number;
      doubleSineAngleDiff: number;
      cosAngleDiff: number;
      denFactor: number;
      velSquaredTimesL: number;
  }

  // initial theta in rad
  constructor(theta1 = PI / 2, theta2 = PI / 4) {
    this.p = [
      // x, y, [theta, theta', theta''], rod length, mass
      [0, 0, [theta1, 0, 0], 120, 10],
      [0, 0, [theta2, 0, 0], 70, 10]
    ]
    // gravity
    this.g = 1;
    // object to store repeated calculations in
    this.mem = {
      massSum: 0,
      biasedMassSum: 0,
      angleDifference: 0,
      doubleSineAngleDiff: 0,
      cosAngleDiff: 0,
      denFactor: 0,
      velSquaredTimesL: 0,
    };
  }
  
  tick() {
    const {p, g, mem} = this;
    const theta = [p[0][2], p[1][2]];

    // extract repeated calculations
    mem.massSum = p[0][4] + p[1][4];
    mem.biasedMassSum = 2 * p[0][4] + p[1][4];
    mem.angleDifference = theta[0][0] - theta[1][0];
    mem.doubleSineAngleDiff = 2 * sin(mem.angleDifference);
    mem.cosAngleDiff = cos(mem.angleDifference);
    mem.denFactor = mem.biasedMassSum - p[1][4] * cos(2 * mem.angleDifference);
    mem.velSquaredTimesL = [
      theta[0][1] * theta[0][1] * p[0][3],
      theta[1][1] * theta[1][1] * p[1][3]
    ];

    const {
      massSum,
      biasedMassSum,
      angleDifference,
      doubleSineAngleDiff,
      cosAngleDiff,
      denFactor,
      velSquaredTimesL,
    } = mem;
    
    // solve for the second derivatives
    // the equations are very long fractions, that's why they were split like this
    const num = [0, 0, 0, 0];
    const den = [
      p[0][3] * denFactor,
      p[1][3] * denFactor
    ];
    
    // for theta 1
    num[0] = -g * biasedMassSum * sin(theta[0][0]);
    num[1] = -p[1][4] * g * sin(theta[0][0] - 2 * theta[1][0]);
    num[2] = -doubleSineAngleDiff * p[1][4];
    num[3] = velSquaredTimesL[1] + theta[0][1] * theta[0][1] * p[0][3] * cosAngleDiff;
    theta[0][2] = (num[0] + num[1] + num[2] * num[3]) / den[0];
    
    // for theta 2
    num[0] = doubleSineAngleDiff;
    num[1] = velSquaredTimesL[0] * massSum;
    num[2] = g * massSum * cos(theta[0][0]);
    num[3] = velSquaredTimesL[1] * p[1][4] * cosAngleDiff; 
    theta[1][2] = (num[0] * (num[1] + num[2] + num[3])) / den[1];
    
    // calculate the new bob positions
    p[0][0] = p[0][3] * sin(theta[0][0]);
    p[0][1] = p[0][3] * cos(theta[0][0]);
    
    p[1][0] = p[0][0] + p[1][3] * sin(theta[1][0]);
    p[1][1] = p[0][1] + p[1][3] * cos(theta[1][0]);
    
    // simulate physics for theta 1 and 2
    for(let i = 0; i < 2; i++) {
      theta[i][1] += theta[i][2];
      theta[i][0] += theta[i][1]
    }
  }
}
