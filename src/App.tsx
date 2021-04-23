import React from 'react';
import './App.css';
import Visualizations from './com/Visualizations'
import SettingsCards from './com/SettingsCards';
import { DoublePendulum } from './sim/double-pendulum';
import PendulumVisualization from './com/PendulumVisualization';
import { Presets } from './data/Presets';
import { audioGraph } from './dsp/audio-graph';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';

const theme = createMuiTheme({
  palette: {
    type: 'dark',
    primary: {
      main: '#2F80ED',
    },
  },
  typography: {
    fontFamily: 'Raleway',
    fontSize: 16,
  }
});

interface ComponentState {
  visualsOrder: {
    [key: string]: string
  },
  highlighted: string
  theta1Value: number
  theta2Value: number
  disabledTheta: boolean
}

class App extends React.Component<{}, ComponentState> {

  doublePendulum: DoublePendulum;
  dpv: any;
  audioGraph: any;
  readonly presets: Presets;
  readonly componentNames: Array<string>;

  constructor(props: any) {
    super(props);

    // use presets in all components as database --> especially in sliders
    this.presets = new Presets();
    this.componentNames = this.presets.getComponentNames();

    this.state = {
      visualsOrder: this.presets.visualsOrder,
      highlighted: '',
      theta1Value: this.presets.oscillator.thetaFirstLeg.default,
      theta2Value: this.presets.oscillator.thetaSecondLeg.default,
      disabledTheta: false
    }

    this.doublePendulum = new DoublePendulum(
      this.presets.getDoublePendulumPresets()
    );

    this.dpv = <PendulumVisualization
      dp={this.doublePendulum}
      memorySettings={this.presets.pvMemorySettings}
      pendulumSettings={this.presets.pvPendulumSettings}
      canvasDoubleClicked={this.canvasDoubleClicked}
    />;
    this.doublePendulum.recalcPositions();

    // create the audio graph
    this.audioGraph = audioGraph;
  }

  setHighlight = (className: string) => {
    this.setState((state) => {
      return {
        highlighted: state.visualsOrder[className]
      }
    });
  }

  clearHighlight = (e: any) => {
    this.setState({
      highlighted: ''
    });
  }

  canvasDoubleClicked = (paused: boolean) => {
    if (paused) {
      this.setState({
        disabledTheta: false,
        theta1Value: Math.round(this.doublePendulum.theta[0] * 100) / 100,
        theta2Value: Math.round(this.doublePendulum.theta[1] * 100) / 100
      });
    } else {
      this.setState({
        disabledTheta: true
      });
    }
  }

  handleOscillatorChange = (param: string, newValue: number) => {
    this.doublePendulum.setValue(param, newValue);
    if (param.startsWith('theta') || param.startsWith('length')) {
      this.doublePendulum.recalcPositions();
    }
    if (param.startsWith('theta')) {

    }
  }

  handleEnvelopeChange = (e: any, newValue: number) => {
    this.audioGraph.setEnvelope({
      identifier: e,
      value: newValue,
    });
  }

  handleFilterChange = (e: any, newValue: number | string) => {
    this.audioGraph.setFilter({
      identifier: e,
      value: newValue,
    });
  }

  handleVolumeChange = (e: any, newValue: number) => {
    this.audioGraph.setMasterGain(newValue);
  }

  render() {
    return (
      <ThemeProvider theme={theme}>
        <div className="App">
          <div className="HeaderCard">
            <h1 className="HeaderText">Pendulum</h1>
            <h3 className="HeaderText">Oscillator based on a double pendulum by Yannick Clausen & Henry Peters</h3>
          </div>
          <Visualizations
            highlighted={this.state.highlighted}
            dpv={this.dpv}
          />
          <SettingsCards
            classNames={this.componentNames}
            presets={this.presets}
            setHighlight={this.setHighlight}
            clearHighlight={this.clearHighlight}
            sliderChanges={{
              'Oscillator': this.handleOscillatorChange,
              'Envelope': this.handleEnvelopeChange,
              'Filter': this.handleFilterChange,
              'Volume': this.handleVolumeChange,
            }}
            theta1Value={this.state.theta1Value}
            theta2Value={this.state.theta2Value}
            disabledTheta={this.state.disabledTheta}
          />
        </div>
      </ThemeProvider>
    );
  }
}

export default App;
