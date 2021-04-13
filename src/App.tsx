import React from 'react';
import './App.css';
import Visualizations from './com/Visualizations'
import SettingsCards from './com/SettingsCards';
import { DoublePendulum } from './sim/double-pendulum';
import { PendulumVisualization } from './com/PendulumVisualization';
import { sliderSettings } from './data/Presets';

interface ComponentState {
  visualsOrder: {
    [key: string]: string
  },
  highlighted: string,
  paused: boolean
}

class App extends React.Component<{}, ComponentState> {

  doublePendulum: DoublePendulum
  dpv: any
  sliderSettings: any

  constructor(props: any) {
    super(props);

    // TODO: use presets in all Components as database --> especially in Sliders 
    this.sliderSettings = sliderSettings;

    this.setHighlight = this.setHighlight.bind(this);
    this.clearHighlight = this.clearHighlight.bind(this);
    this.handleSliderChange = this.handleSliderChange.bind(this);

    this.state = {
      visualsOrder: {
        'Oscillator': 'FocusCard',
        'Envelope': 'DetailTopCard',
        'Filter': 'DetailCenterCard',
        'Volume': 'DetailBottomCard',
      },
      highlighted: '',
      paused: false
    }

    this.doublePendulum = new DoublePendulum({
      theta: [
        Math.random() * Math.PI * 2,
        Math.random() * Math.PI * 2,
      ],
      l: [160, 160],
      m: [10, 10],
      g: 0.8,
    });
    this.dpv = PendulumVisualization({
      dp: this.doublePendulum,
      memorySettings: {
        drawMode: 'fadingLine',
        maxMem: 400,
        fadingStart: 150,
        strokeWeight: 1,
        drawColor: [200, 200, 200]
      },
      pendulumSettings: {
        drawColor: [255, 255, 255],
        legWeight: 4,
        ankleWidth: 10
      }
    });

  }

  setHighlight(className: string) {
    const currentState = this.state;
    this.setState({
      visualsOrder: currentState.visualsOrder,
      highlighted: currentState.visualsOrder[className]
    });
  }

  clearHighlight(e: any) {
    const currentState = this.state;
    this.setState({
      visualsOrder: currentState.visualsOrder,
      highlighted: ''
    });
  }

  handleSliderChange(e: any, newValue: number) {
    console.log(newValue);
  }

  render() {
    return (
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
          classNames={Object.keys(this.state.visualsOrder)}
          onMouseEnterChild={this.setHighlight}
          onMouseLeaveChild={this.clearHighlight}
          handleSliderChange={this.handleSliderChange}
        />
      </div>
    );
  }
}

export default App;
