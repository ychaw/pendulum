import React from 'react';
import './App.css';
import Visualizations from './com/Visualizations'
import SettingsCards from './com/SettingsCards';
import { DoublePendulum } from './sim/double-pendulum';
import { PendulumVisualization } from './com/PendulumVisualization';
import { Presets } from './data/Presets';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#2F80ED',
    },
  },
});

interface ComponentState {
  visualsOrder: {
    [key: string]: string
  },
  highlighted: string
}

class App extends React.Component<{}, ComponentState> {

  doublePendulum: DoublePendulum;
  dpv: any;
  readonly presets: Presets;
  readonly componentNames: Array<string>;

  constructor(props: any) {
    super(props);

    // use presets in all components as database --> especially in sliders
    this.presets = new Presets();
    this.componentNames = this.presets.getComponentNames();

    this.setHighlight = this.setHighlight.bind(this);
    this.clearHighlight = this.clearHighlight.bind(this);
    this.handleOscillatorChange = this.handleOscillatorChange.bind(this);
    this.handleEnvelopeChange = this.handleEnvelopeChange.bind(this);
    this.handleVolumeChange = this.handleVolumeChange.bind(this);

    this.state = {
      visualsOrder: this.presets.visualsOrder,
      highlighted: ''
    }

    this.doublePendulum = new DoublePendulum(
      this.presets.getDoublePendulumPresets()
    );
    this.dpv = PendulumVisualization({
      dp: this.doublePendulum,
      memorySettings: this.presets.pvMemorySettings,
      pendulumSettings: this.presets.pvPendulumSettings
    });

  }

  setHighlight(className: string) {
    this.setState((state) => {
      return {
        highlighted: state.visualsOrder[className]
      }
    });
  }

  clearHighlight(e: any) {
    this.setState({
      highlighted: ''
    });
  }

  handleOscillatorChange(e: any, newValue: number) {
    console.log(e, newValue);
  }

  handleEnvelopeChange(e: any, newValue: number) {
    console.log(e, newValue);
  }

  handleFilterChange(e: any, newValue: number) {
    console.log(e, newValue);
  }

  handleVolumeChange(e: any, newValue: number) {
    console.log(newValue);
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
          />
        </div>
      </ThemeProvider>
    );
  }
}

export default App;
