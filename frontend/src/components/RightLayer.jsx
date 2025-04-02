// import React, {  useMemo, useCallback, useEffect } from "react";
// import LULC from "../assets/LULC";
// import Search from "./Search";
// import "../styles/RightLayer.css";

// const LULC_COLORS = {
//   "Agriculture Land": "#4CAF50",
//   Forest: "#2E7D32",
//   "Water Body": "#1E88E5",
//   "Built Up": "#8E24AA",
//   Wastelands: "#6D4C41",
//   others: "#757575",
// };

// export default function RightLayer({
//   settings,
//   setSettings,
//   isPOISectionVisible,
//   setIsPOISectionVisible,

//   lulcToggles,
//   setLulcToggles,
//   isLULCSectionVisible,
//   setIsLULCSectionVisible,
// }) {


//   const lulcCategories = useMemo(() => {
//     return [
//       ...new Set(
//         LULC.features.map((f) => f.properties?.LULC_1).filter(Boolean)
//       ),
//     ].sort((a, b) => {
//       if (a.toLowerCase() === "others") return 1;
//       if (b.toLowerCase() === "others") return -1;
//       return a.localeCompare(b);
//     });
//   }, []);

//   useEffect(() => {
//     const initialToggles = lulcCategories.reduce((acc, category) => {
//       acc[category] = false;
//       return acc;
//     }, {});
//     setLulcToggles(initialToggles);
//   }, [lulcCategories]);

//   const toggleSetting = useCallback(
//     (key) => setSettings((prev) => ({ ...prev, [key]: !prev[key] })),
//     [setSettings]
//   );

//   const toggleLULCCategory = useCallback((category) => {
//     setLulcToggles((prev) => ({
//       ...prev,
//       [category]: !prev[category],
//     }));
//   }, []);

//   const renderToggle = (label, key) => (
//     <div className="toggle-container" key={key}>
//       <button
//         className={`toggle ${settings[key] ? "toggle-active" : ""}`}
//         onClick={() => toggleSetting(key)}
//         aria-checked={settings[key]}
//         role="switch"
//       >
//         <span className="toggle-thumb"></span>
//       </button>
//       <span className="toggle-label">{label}</span>
//     </div>
//   );

//   const renderLULCToggle = (category) => (
//     <div className="toggle-container lulc-toggle-container" key={category}>
//       <div
//         className="lulc-color-box"
//         style={{ backgroundColor: LULC_COLORS[category] || "#ccc" }}
//         title={category}
//       ></div>
//       <span className="toggle-label">{category}</span>
//       <button
//         className={`toggle ${lulcToggles[category] ? "toggle-active" : ""}`}
//         onClick={() => toggleLULCCategory(category)}
//         aria-checked={lulcToggles[category]}
//         role="switch"
//       >
//         <span className="toggle-thumb"></span>
//       </button>
//     </div>
//   );

//   return (
//     <div className="layers-panel">
//       <h3 className="panel-title">Layers</h3>
//       <div className="section">
//         <h4 className="section-title">Administrative boundaries</h4>
//         <div className="toggle-group">
//           {renderToggle("District boundaries", "district")}
//           {renderToggle("Mandal boundaries", "mandal")}
//           {renderToggle("Village boundaries", "village")}
//         </div>
//       </div>

//       <div className="section">
//         <div className="section-header">
//           <h4 className="section-title">Points of Interest</h4>
//           <button
//             className={`toggle section-toggle ${
//               isPOISectionVisible ? "toggle-active" : ""
//             }`}
//             onClick={() => setIsPOISectionVisible((prev) => !prev)}
//             aria-checked={isPOISectionVisible}
//             role="switch"
//           >
//             <span className="toggle-thumb"></span>
//           </button>
//         </div>
//         {isPOISectionVisible && (
//           <div className="toggle-group font__">
//             {renderToggle("Anganwadi Centers", "anganwadi")}
//             {renderToggle("Canal", "canal")}
//             {renderToggle("Forest", "forest")}
//             {renderToggle("CivilSupplies", "civilSupplies")}
//             {renderToggle("Muncipalities", "muncipalities")}
//             {renderToggle("Hospitals", "hospitals")}
//             {renderToggle("Museums", "archmuse")}
//             {renderToggle("Drainage", "drainage")}
//             {renderToggle("Electric Poles", "electricpoles")}
//             {renderToggle("Police Station", "policeSt")}
//             {renderToggle("Police Surveilance", "policeSur")}
//             {renderToggle("Railway Network", "railway")}
//             {renderToggle("River", "river")}
//             {renderToggle("Roads", "roads")}
//           </div>
//         )}
//       </div>

//       <div className="section">
//         <div className="section-header">
//           <h4 className="section-title">LULC</h4>
//           <button
//             className={`toggle section-toggle ${
//               isLULCSectionVisible ? "toggle-active" : ""
//             }`}
//             onClick={() => setIsLULCSectionVisible((prev) => !prev)}
//             aria-checked={isLULCSectionVisible}
//             role="switch"
//           >
//             <span className="toggle-thumb"></span>
//           </button>
//         </div>
//         {isLULCSectionVisible && (
//           <div className="toggle-group">
//             {lulcCategories.map((cat) => renderLULCToggle(cat))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

import React, { useMemo, useCallback, useEffect } from "react";
import LULC from "../assets/LULC";
import "../styles/RightLayer.css";

const LULC_COLORS = {
  "Agriculture Land": "#4CAF50",
  Forest: "#2E7D32",
  "Water Body": "#1E88E5",
  "Built Up": "#8E24AA",
  Wastelands: "#6D4C41",
  others: "#757575",
};

export default function RightLayer({
  settings,
  setSettings,
  isAdminBoundariesVisible,
  setIsAdminBoundariesVisible,
  isPOISectionVisible,
  setIsPOISectionVisible,
  lulcToggles,
  setLulcToggles,
  isLULCSectionVisible,
  setIsLULCSectionVisible,
}) {
  const lulcCategories = useMemo(() => {
    return [
      ...new Set(
        LULC.features.map((f) => f.properties?.LULC_1).filter(Boolean)
      ),
    ].sort((a, b) => {
      if (a.toLowerCase() === "others") return 1;
      if (b.toLowerCase() === "others") return -1;
      return a.localeCompare(b);
    });
  }, []);

  useEffect(() => {
    const initialToggles = lulcCategories.reduce((acc, category) => {
      acc[category] = false;
      return acc;
    }, {});
    setLulcToggles(initialToggles);
  }, [lulcCategories, setLulcToggles]);

  const toggleSetting = useCallback(
    (key) => setSettings((prev) => ({ ...prev, [key]: !prev[key] })),
    [setSettings]
  );

  const toggleLULCCategory = useCallback((category) => {
    setLulcToggles((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  }, [setLulcToggles]);

  const renderToggle = (label, key) => (
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
  );

  const renderLULCToggle = (category) => (
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
  );

  return (
    <div className="layers-panel">
      <h3 className="panel-title">Layers</h3>
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
                  setSettings((prevSettings) => ({
                    ...prevSettings,
                    district: false,
                    mandal: false,
                    village: false,
                  }));
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
    </div>
  );
}