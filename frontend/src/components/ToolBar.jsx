import React from "react";
import {
  FaPrint,
  FaSearch,
  FaHandPaper,
  FaRulerVertical,
  FaDrawPolygon,
} from "react-icons/fa";
import "../styles/ToolBar.css";

const tools = [
  { icon: FaPrint, tooltip: "Print", tool: "print" },
  { icon: FaHandPaper, tooltip: "Pan", tool: "pan" },
  { icon: FaRulerVertical, tooltip: "Line Scale", tool: "line" },
  { icon: FaDrawPolygon, tooltip: "Polygon Scale", tool: "polygon" },
];

const ToolBar = ({ activeTool, setActiveTool }) => {
  return (
    <div className="toolbar">
      {tools.map(({ icon: Icon, tooltip, tool }) => (
        <div
          key={tool}
          className={`toolbar-item ${activeTool === tool ? "active" : ""}`}
          onClick={() => setActiveTool(tool)}
          title={tooltip}
        >
          <Icon className="toolbar-icon" />
        </div>
      ))}
    </div>
  );
};

export default ToolBar;
