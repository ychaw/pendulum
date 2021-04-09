import React from 'react';
import './App.css';
import Visualizations from './com/Visualizations'
import SettingsCards from './com/SettingsCards';
import { DoublePendulum } from './sim/double-pendulum';
import { PendulumVisualization } from './com/PendulumVisualization';

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

  constructor(props: any) {
    super(props);

    this.setHighlight = this.setHighlight.bind(this);
    this.clearHighlight = this.clearHighlight.bind(this);

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
        Math.PI / 2,
        Math.PI / 2,
      ],
      l: [160, 160],
      m: [10, 10],
      g: 1,
    });
    this.dpv = PendulumVisualization({ dp: this.doublePendulum, continuousLine: true });

  }

  setHighlight(e: any) {
    const currentState = this.state;
    this.setState({
      visualsOrder: currentState.visualsOrder,
      highlighted: currentState.visualsOrder[e.target.id]
    });
  }

  clearHighlight(e: any) {
    const currentState = this.state;
    this.setState({
      visualsOrder: currentState.visualsOrder,
      highlighted: ''
    });
  }

  render() {
    return (
      <div className="App">
        <div className="HeaderCard">
          <h1 className="HeaderText">Pendulum</h1>
          <h3 className="HeaderText">Oscillator based on a double pendulum by Yannick Clausen & Henry Peters</h3>
        </div>
        <Visualizations highlighted={this.state.highlighted} dpv={this.dpv} />
        <SettingsCards classNames={Object.keys(this.state.visualsOrder)} onMouseEnterChild={this.setHighlight} onMouseLeaveChild={this.clearHighlight} />
      </div>
    );
  }
}

export default App;
