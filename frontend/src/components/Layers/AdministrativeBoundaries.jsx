import React, { useCallback } from "react";
import "../../styles/Layers.css";

export default function AdministrativeBoundaries({
  settings,
  toggleSetting,
  isAdminBoundariesVisible,
  setIsAdminBoundariesVisible,
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
        <h4 className="section-title">Administrative Boundaries</h4>
        <button
          className={`toggle section-toggle ${
            isAdminBoundariesVisible ? "toggle-active" : ""
          }`}
          onClick={() => {
            setIsAdminBoundariesVisible((prev) => {
              const newValue = !prev;
              if (!newValue) {
                toggleSetting("district");
                toggleSetting("mandal");
                toggleSetting("village");
              }
              return newValue;
            });
          }}
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
