import React from "react";
import "../../styles/Layers.css";

export default function Cadastral({ cadastralVisible, setCadastralVisible }) {
  return (
    <div className="section">
      <div className="section-header">
        <h4 className="section-title">Cadastral</h4>
        <button
          className={`toggle section-toggle ${
            cadastralVisible ? "toggle-active" : ""
          }`}
          onClick={() => setCadastralVisible((prev) => !prev)}
          aria-checked={cadastralVisible}
          role="switch"
        >
          <span className="toggle-thumb"></span>
        </button>
      </div>
    </div>
  );
}
