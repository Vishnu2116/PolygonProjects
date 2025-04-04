import React, { useCallback, useRef } from "react";
import "../../styles/Layers.css";

export default function AdministrativeBoundaries({
  settings,
  toggleSetting,
  setSettings,
  isAdminBoundariesVisible,
  setIsAdminBoundariesVisible,
}) {
  const previousSettingsRef = useRef(settings); // Stores last ON settings

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

  const handleMainToggle = () => {
    const newValue = !isAdminBoundariesVisible;
    setIsAdminBoundariesVisible(newValue);

    if (!newValue) {
      // Store current state before turning off
      previousSettingsRef.current = { ...settings };
      // Turn everything off
      setSettings({
        district: false,
        mandal: false,
        village: false,
      });
    } else {
      // Restore previous state
      setSettings(previousSettingsRef.current);
    }
  };

  return (
    <div className="section">
      <div className="section-header">
        <h4 className="section-title">Administrative Boundaries</h4>
        <button
          className={`toggle section-toggle ${
            isAdminBoundariesVisible ? "toggle-active" : ""
          }`}
          onClick={handleMainToggle}
          aria-checked={isAdminBoundariesVisible}
          role="switch"
        >
          <span className="toggle-thumb"></span>
        </button>
      </div>

      {isAdminBoundariesVisible && (
        <div className="toggle-group">
          {renderToggle("District boundaries", "district")}
          {renderToggle("Mandal boundaries", "mandal")}
          {renderToggle("Village boundaries", "village")}
        </div>
      )}
    </div>
  );
}
