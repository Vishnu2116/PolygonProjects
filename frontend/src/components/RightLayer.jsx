import "../styles/RightLayer.css";

export default function RightLayer({
  settings,
  setSettings,
  isPOISectionVisible,
  setIsPOISectionVisible,
}) {
  const toggleSetting = (key) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  function renderToggle(label, key) {
    return (
      <div className="toggle-container">
        <button
          className={`toggle ${settings[key] ? "toggle-active" : ""}`}
          onClick={() => toggleSetting(key)}
          aria-checked={settings[key]}
          role="switch"
        >
          <span className="toggle-thumb"></span>
        </button>
        <span className="toggle-label">{label}</span>
      </div>
    );
  }

  return (
    <div className="layers-panel">
      <h3 className="panel-title">Layers</h3>

      <div className="section">
        <h4 className="section-title">Administrative boundaries</h4>
        <div className="toggle-group">
          {renderToggle("District boundaries", "district")}
          {renderToggle("Mandal boundaries", "mandal")}
          {renderToggle("Village boundaries", "village")}
        </div>
      </div>

      <div className="section">
        <div className="section-header">
          <h4 className="section-title">Points of Interest</h4>
          <button
            className={`toggle section-toggle ${
              isPOISectionVisible ? "toggle-active" : ""
            }`}
            onClick={() => setIsPOISectionVisible((prev) => !prev)}
            aria-checked={isPOISectionVisible}
            role="switch"
          >
            <span className="toggle-thumb"></span>
          </button>
        </div>

        {/* ✅ Only show these toggles if POI section is turned on */}
        {isPOISectionVisible && (
          <div className="toggle-group">
            {renderToggle("Anganwadi Centers", "anganwadi")}
            {renderToggle("Canal", "canal")}
            {renderToggle("Forest", "forest")}
          </div>
        )}
      </div>
    </div>
  );
}
