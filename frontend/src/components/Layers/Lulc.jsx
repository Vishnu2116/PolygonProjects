import React, { useCallback } from "react";
import "../../styles/Layers.css";
const LULC_COLORS = {
  "Agriculture Land": "#4CAF50",
  Forest: "#2E7D32",
  "Water Body": "#1E88E5",
  "Built Up": "#8E24AA",
  Wastelands: "#6D4C41",
  others: "#757575",
};

export default function Lulc({
  lulcToggles,
  toggleLULCCategory,
  isLULCSectionVisible,
  setIsLULCSectionVisible,
  lulcCategories,
}) {
  const renderLULCToggle = useCallback(
    (category) => (
      <div className="toggle-container lulc-toggle-container" key={category}>
        <div
          className="lulc-color-box"
          style={{ backgroundColor: LULC_COLORS[category] || "#ccc" }}
          title={category}
        ></div>
        <span className="toggle-label">{category}</span>
        <button
          className={`toggle ${lulcToggles[category] ? "toggle-active" : ""}`}
          onClick={() => toggleLULCCategory(category)}
          aria-checked={lulcToggles[category]}
          role="switch"
        >
          <span className="toggle-thumb"></span>
        </button>
      </div>
    ),
    [lulcToggles, toggleLULCCategory]
  );

  return (
    <div className="section">
      <div className="section-header">
        <h4 className="section-title">LULC</h4>
        <button
          className={`toggle section-toggle ${
            isLULCSectionVisible ? "toggle-active" : ""
          }`}
          onClick={() => setIsLULCSectionVisible((prev) => !prev)}
          aria-checked={isLULCSectionVisible}
          role="switch"
        >
          <span className="toggle-thumb"></span>
        </button>
      </div>
      {isLULCSectionVisible && (
        <div className="toggle-group">
          {lulcCategories.map((cat) => renderLULCToggle(cat))}
        </div>
      )}
    </div>
  );
}
