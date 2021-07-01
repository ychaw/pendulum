import React from 'react';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import './App.css';

import { A, D, S, R, FILTER_RESOLUTION } from './data/Constants';
import { Presets } from './data/Presets';

import AudioGraph from './dsp/audio-graph';
import DoublePendulum from './sim/double-pendulum';

import Visualizations from './com/Visualizations'
import SettingsCards from './com/SettingsCards';
import PendulumVisualization from './com/PendulumVisualization';
import EnvelopeVisualization from './com/EnvelopeVisualization';
import FilterVisualization from './com/FilterVisualization';
import VolumeVisualization from './com/VolumeVisualizationP5';

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
  pendulumPaused: boolean
  envelopeA: number,
  envelopeD: number,
  envelopeS: number,
  envelopeR: number,
  filterSpectrum: Float32Array,
  volume: number,
  disabledEnvelope: boolean
  greeterOpen: boolean
}

class App extends React.Component<{}, ComponentState> {

  doublePendulum: DoublePendulum;
  audioGraph: AudioGraph;
  readonly presets: Presets;
  readonly componentNames: Array<string>;

  constructor(props: any) {
    super(props);

    // use presets in all components as database --> especially in sliders
    this.presets = new Presets();
    this.componentNames = this.presets.getComponentNames();

    // create the double pendulum
    this.doublePendulum = new DoublePendulum(this.presets.getDoublePendulumPresets())
    this.doublePendulum.recalcPositions();

    // create the audio graph
    this.audioGraph = new AudioGraph(this.doublePendulum);

    this.state = {
      visualsOrder: this.presets.visualsOrder,
      highlighted: '',
      theta1Value: this.presets.oscillator.thetaFirstLeg.default,
      theta2Value: this.presets.oscillator.thetaSecondLeg.default,
      pendulumPaused: true,
      envelopeA: (this.presets.envelope.a.default / this.presets.envelope.a.max) * 100,
      envelopeD: (this.presets.envelope.d.default / this.presets.envelope.d.max) * 100,
      envelopeS: (this.presets.envelope.s.default / this.presets.envelope.s.max) * 100,
      envelopeR: (this.presets.envelope.r.default / this.presets.envelope.r.max) * 100,
      filterSpectrum: this.audioGraph.getFilterSpectrum(FILTER_RESOLUTION),
      volume: this.presets.volume.volume.default,
      disabledEnvelope: !this.audioGraph.hasMIDI,
      greeterOpen: true
    }
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
      this.audioGraph.audioContext.suspend();
      this.setState({
        pendulumPaused: true,
        theta1Value: Math.round(this.doublePendulum.theta[0] * 100) / 100,
        theta2Value: Math.round(this.doublePendulum.theta[1] * 100) / 100
      });
    } else {
      this.audioGraph.audioContext.resume();
      this.setState({
        pendulumPaused: false
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
    switch (e) {
      case A:
        this.setState({ envelopeA: (newValue / this.presets.envelope.a.max) * 100 });
        break;
      case D:
        this.setState({ envelopeD: (newValue / this.presets.envelope.d.max) * 100 });
        break;
      case S:
        this.setState({ envelopeS: (newValue / this.presets.envelope.s.max) * 100 });
        break;
      case R:
        this.setState({ envelopeR: (newValue / this.presets.envelope.r.max) * 100 });
        break;
    }
  }

  handleFilterChange = (e: any, newValue: number | 'lp' | 'hp' | 'bp' | 'notch') => {
    this.audioGraph.setFilter({
      identifier: e,
      value: newValue,
    });
    this.setState({ filterSpectrum: this.audioGraph.getFilterSpectrum(FILTER_RESOLUTION) });
  }

  handleVolumeChange = (e: any, newValue: number) => {
    this.audioGraph.setMasterGain(newValue);
    this.setState({ volume: newValue });
  }

  handleModalClose = () => {
    this.setState({
      greeterOpen: false,
      disabledEnvelope: !this.audioGraph.hasMIDI
    });
  };

  render() {
    return (
      <ThemeProvider theme={theme}>
        <div className="App">
          <div className="HeaderCard">
            <h1 className="HeaderText">Pendulum</h1>
            <h3 className="HeaderText">Oscillator based on a double pendulum by Yannick Clausen & Henry Peters</h3>
          </div>
          <Modal
            open={this.state.greeterOpen}
            onClose={this.handleModalClose}
            aria-labelledby="greeter"
            aria-describedby="greeter explaining the application"
          >
            <div className="greeter">
              <h2 className="HeaderText">Welcome!</h2>
              <p className="greeterText" style={{marginTop: "2em"}}>
      This synthesizer will try to use any MIDI device connected to your system as a controller.
              </p>
              <p className="greeterText">
      Start the simulation by double-clicking the largest frame with the pendulum inside and increase the volume via the slider to the bottom right.
              </p>
              <p className="greeterText">
      We hope you will enjoy our work!
              </p>
              <button onClick={() => { this.audioGraph.setupMidi(); this.setState({ greeterOpen: false, disabledEnvelope: false })}}>Enable MIDI</button>
              <button onClick={this.handleModalClose}>Don't enable MIDI</button>
            </div>
          </Modal>
          <Visualizations
            highlighted={this.state.highlighted}
            doublePendulumVisualization={
              <PendulumVisualization
                dp={this.doublePendulum}
                memorySettings={this.presets.pvMemorySettings}
                pendulumSettings={this.presets.pvPendulumSettings}
                canvasDoubleClicked={this.canvasDoubleClicked}
              />
            }
            envelopeVisualization={
              <EnvelopeVisualization
                a={this.state.envelopeA}
                d={this.state.envelopeD}
                s={this.state.envelopeS}
                r={this.state.envelopeR}
              />
            }
            filterVisualization={
              <FilterVisualization
                spectrum={this.state.filterSpectrum}
              />
            }
            volumeVisualization={
              <VolumeVisualization
                dp={this.doublePendulum}
                paused={this.state.pendulumPaused}
                volume={this.state.volume}
              />
            }
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
            disabledTheta={!this.state.pendulumPaused}
            disabledEnvelope={this.state.disabledEnvelope}
          />
        </div>
      </ThemeProvider>
    );
  }
}

export default App;
