import './App.css';

function App() {
  return (
    <div className="App">
      <div className="HeaderCard">
        <h1 className="HeaderText">Pendulum</h1>
        <h3 className="HeaderText">Oscillator based on a double pendulum by Yannick Clausen & Henry Peters</h3>
      </div>
      <div className="FocusCard"></div>
      <div className="DetailTopCard"></div>
      <div className="DetailCenterCard"></div>
      <div className="DetailBottomCard"></div>
      <div className="SettingsOscillatorCard">
        <div className="SettingsHeader">Oscillator</div>
        <div className="SettingsContent"></div>
      </div>
      <div className="SettingsEnvelopeCard">
        <div className="SettingsHeader">Envelope</div>
        <div className="SettingsContent"></div>
      </div>
      <div className="SettingsFilterCard">
        <div className="SettingsHeader">Filter</div>
        <div className="SettingsContent"></div>
      </div>
      <div className="SettingsVolumeCard">
        <div className="SettingsHeader">Volume</div>
        <div className="SettingsContent"></div>
      </div>
    </div>
  );
}

export default App;
