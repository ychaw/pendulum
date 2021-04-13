export const sliderSettings: any = () => {
  return {
    'Oscillator': {
      'Theta First Leg': {
        'min': 0,
        'max': Math.PI * 2,
        'default': Math.random() * Math.PI * 2
      },
      'Theta Second Leg': {
        'min': 0,
        'max': Math.PI * 2,
        'default': Math.random() * Math.PI * 2
      },
      'Length First Leg': {
        'min': 10,
        'max': 160,
        'default': 160
      },
      'Length Second Leg': {
        'min': 10,
        'max': 160,
        'default': 160
      },
      'Mass First Ankle': {
        'min': 0,
        'max': 100,
        'default': 10
      },
      'Mass Second Ankle': {
        'min': 0,
        'max': 100,
        'default': 10
      },
      'Gravitation': {
        'min': 0,
        'max': 10,
        'default': 0.8
      }
    },
    'Envelope': {
      'A': {
        'min': 0,
        'max': 10,
        'default': 1
      },
      'D': {
        'min': 0,
        'max': 10,
        'default': 1
      },
      'S': {
        'min': 0,
        'max': 10,
        'default': 1
      },
      'R': {
        'min': 0,
        'max': 10,
        'default': 1
      },
    },
    'Filter': {
      'Type': {
        'options': ['Low Pass', 'High Pass', 'Band Pass', 'Notch'], // ?
        'default': 'Low Pass'
      },
      'Frequency': {
        'min': 0,
        'max': 0,
        'default': 0
      }
    },
    'Volume': {
      'min': 0,
      'max': 100,
      'default': 50
    },
  }
}