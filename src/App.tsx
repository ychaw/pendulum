import React from 'react';
import './App.css';
import Visualizations from './Visualizations'

class App extends React.Component<{}, { visualsOrder: any, highlighted: string }> {

  constructor(props) {
    super(props);
    this.highlight = this.highlight.bind(this);
    this.clearHighlight = this.clearHighlight.bind(this);
    this.state = {
      visualsOrder: {
        'Oscillator': 'FocusCard',
        'Envelope': 'DetailTopCard',
        'Filter': 'DetailCenterCard',
        'Volume': 'DetailBottomCard',
      },
      highlighted: ''
    }
  }

  highlight(e: any) {
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
        <Visualizations highlighted={this.state.highlighted} />
        <div className="SettingsOscillatorCard" id="Oscillator" onMouseEnter={this.highlight} onMouseLeave={this.clearHighlight}>
          <div className="SettingsHeader">Oscillator</div>
          <div className="SettingsContent"></div>
        </div>
        <div className="SettingsEnvelopeCard" id="Envelope" onMouseEnter={this.highlight} onMouseLeave={this.clearHighlight}>
          <div className="SettingsHeader">Envelope</div>
          <div className="SettingsContent"></div>
        </div>
        <div className="SettingsFilterCard" id="Filter" onMouseEnter={this.highlight} onMouseLeave={this.clearHighlight}>
          <div className="SettingsHeader">Filter</div>
          <div className="SettingsContent"></div>
        </div>
        <div className="SettingsVolumeCard" id="Volume" onMouseEnter={this.highlight} onMouseLeave={this.clearHighlight}>
          <div className="SettingsHeader">Volume</div>
          <div className="SettingsContent"></div>
        </div>
      </div>
    );
  }
}

export default App;
