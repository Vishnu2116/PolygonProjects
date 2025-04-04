import React from "react";
import "../../styles/Layers.css";

export default function Topography({
  topographyVisible,
  setTopographyVisible,
}) {
  return (
    <div className="section">
      <div className="section-header">
        <h4 className="section-title">Topography</h4>
        <button
          className={`toggle section-toggle ${
            topographyVisible ? "toggle-active" : ""
          }`}
          onClick={() => setTopographyVisible((prev) => !prev)}
          aria-checked={topographyVisible}
          role="switch"
        >
          <span className="toggle-thumb"></span>
        </button>
      </div>
    </div>
  );
}
