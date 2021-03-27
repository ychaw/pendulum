import './App.css';

function App() {
  return (
    <div className="App">

      <div className="AnimationWindow">

        <div className="FocusWindow">

          <div className="FocusCard"></div>
          
        </div>

        <div className="DetailWindow">

          <div className="DetailTopCard"></div>
          <div className="DetailCenterCard"></div>
          <div className="DetailBottomCard"></div>

        </div>

      </div>

      <div className="SettingsWindow">

        <div className="SettingsOscillatorCard"></div>
        <div className="SettingsEnvelopeCard"></div>
        <div className="SettingsFilterCard"></div>
        <div className="SettingsVolumeCard"></div>

      </div>

    </div>
  );
}

export default App;
