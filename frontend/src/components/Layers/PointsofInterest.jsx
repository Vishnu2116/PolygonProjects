import React, { useCallback } from "react";
import "../../styles/Layers.css";

export default function PointsofInterest({
  settings,
  toggleSetting,
  isPOISectionVisible,
  setIsPOISectionVisible,
}) {
  const renderToggle = useCallback(
    (label, key) => (
      <div className="toggle-container" key={key}>
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
    ),
    [settings, toggleSetting]
  );

  return (
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
      {isPOISectionVisible && (
        <div className="toggle-group font__">
          {renderToggle("Anganwadi Centers", "anganwadi")}
          {renderToggle("Canal", "canal")}
          {renderToggle("Forest", "forest")}
          {renderToggle("CivilSupplies", "civilSupplies")}
          {renderToggle("Muncipalities", "muncipalities")}
          {renderToggle("Hospitals", "hospitals")}
          {renderToggle("Museums", "archmuse")}
          {renderToggle("Drainage", "drainage")}
          {renderToggle("Electric Poles", "electricpoles")}
          {renderToggle("Police Station", "policeSt")}
          {renderToggle("Police Surveilance", "policeSur")}
          {renderToggle("Railway Network", "railway")}
          {renderToggle("River", "river")}
          {renderToggle("Roads", "roads")}
        </div>
      )}
    </div>
  );
}
