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
    this.handleSliderChange = this.handleSliderChange.bind(this);

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
    console.log('set Highlight')
    this.setState((state) => {
      return {
        highlighted: state.visualsOrder[className]
      }
    });
  }

  clearHighlight(e: any) {
    console.log('clear Highlight')
    this.setState({
      highlighted: ''
    });
  }

  handleSliderChange(e: any, newValue: number) {
    console.log(newValue);
  }

  render() {
    console.log('render');
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
            onMouseEnterChild={this.setHighlight}
            onMouseLeaveChild={this.clearHighlight}
            handleSliderChange={this.handleSliderChange}
          />
        </div>
      </ThemeProvider>
    );
  }
}

export default App;
