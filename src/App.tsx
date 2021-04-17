import React from 'react';
import './App.css';
import Visualizations from './com/Visualizations'
import SettingsCards from './com/SettingsCards';
import { DoublePendulum } from './sim/double-pendulum';
import { PendulumVisualization } from './com/PendulumVisualization';
import { Presets } from './data/Presets';
import { audioGraph } from './dsp/audio-graph';

interface ComponentState {
  visualsOrder: {
    [key: string]: string
  },
  highlighted: string
}

class App extends React.Component<{}, ComponentState> {

  doublePendulum: DoublePendulum;
  dpv: any;
  audioGraph: any;
  sliderChangeHandlers: Object;
  readonly presets: Presets;
  readonly componentNames: Array<string>;

  constructor(props: any) {
    super(props);

    // use presets in all components as database --> especially in sliders 
    this.presets = new Presets();
    this.componentNames = this.presets.getComponentNames();

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

    this.doublePendulum = new DoublePendulum(
      this.presets.getDoublePendulumPresets()
    );
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

    // create the audio graph
    this.audioGraph = audioGraph;

    this.sliderChangeHandlers = {
      masterGain: (e: any, newValue: number) => {
        this.audioGraph.setGain(newValue);
      },
      log: (e: any, newValue: number) => {
        console.log(newValue);
      },
    }
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

  render() {
    return (
      <div className="App" onClick={() => this.audioGraph.audioContext.resume()}>
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
          sliderChangeHandlers={this.sliderChangeHandlers}
        />
      </div>
    );
  }
}

export default App;
