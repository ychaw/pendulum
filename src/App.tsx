import React from 'react';
import './App.css';
import Visualizations from './com/Visualizations'
import SettingsCards from './com/SettingsCards';

class App extends React.Component<{}, { visualsOrder: { [key: string]: string }, highlighted: string }> {

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
      highlighted: ''
    }
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
        <Visualizations highlighted={this.state.highlighted} />
        <SettingsCards classNames={Object.keys(this.state.visualsOrder)} onMouseEnterChild={this.setHighlight} onMouseLeaveChild={this.clearHighlight} />
      </div>
    );
  }
}

export default App;
