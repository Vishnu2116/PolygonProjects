import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import MapView from "../components/MapView";
import RightLayer from "../components/RightLayer";
import RecordDetails from "../components/Records/RecordDetails";
import "../styles/HomePage.css";
import ToolBar from "../components/ToolBar";
import Search from "../components/Search";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5001";

export default function HomePage({ onLogout }) {
  const [selectedFeature, setSelectedFeature] = useState(null);
  const [isPOISectionVisible, setIsPOISectionVisible] = useState(false);
  const [isLULCSectionVisible, setIsLULCSectionVisible] = useState(false);
  const [districts, setDistricts] = useState(null);
  const [mandals, setMandals] = useState(null);
  const [villages, setVillages] = useState(null);
  const [highlightDistrict, setHighlightDistrict] = useState(null);
  const [highlightMandal, setHighlightMandal] = useState(null);
  const [highlightVillage, setHighlightVillage] = useState(null);
  const [lulcToggles, setLulcToggles] = useState({});
  const [activeTool, setActiveTool] = useState(null);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);

  const [poiSettings, setPoiSettings] = useState({
    district: false,
    mandal: false,
    village: false,
    anganwadi: false,
    canal: false,
    forest: false,
    civilSupplies: false,
    muncipalities: false,
    hospitals: false,
    archmuse: false,
    drainage: false,
    electricpoles: false,
    policeSt: false,
    policeSur: false,
    railway: false,
    river: false,
    roads: false,
  });

  const handleLogout = async () => {
    await fetch(`${API_BASE}/api/logout`, {
      method: "POST",
      credentials: "include",
    });
    onLogout();
  };

  useEffect(() => {
    const loadGeoJSON = async () => {
      try {
        const [d, m, v] = await Promise.all([
          fetch("/District.json"),
          fetch("/Mandal.json"),
          fetch("/Village.json"),
        ]);
        const [districtData, mandalData, villageData] = await Promise.all([
          d.json(),
          m.json(),
          v.json(),
        ]);
        setDistricts(districtData);
        setMandals(mandalData);
        setVillages(villageData);
      } catch (err) {
        console.error("GeoJSON loading failed:", err);
      }
    };
    loadGeoJSON();
  }, []);

  return (
    <div className="app-container">
      <Navbar onLogout={handleLogout} />
      <div className="map-container">
        <div
          className="records-container"
          style={{ pointerEvents: selectedFeature ? "auto" : "none" }}
        >
          {selectedFeature && (
            <RecordDetails
              data={selectedFeature}
              isSearchExpanded={isSearchExpanded}
              onClose={() => setSelectedFeature(null)}
            />
          )}
        </div>

        <MapView
          onSelectPolygon={(props) => setSelectedFeature(props)}
          poiSettings={poiSettings}
          isPOISectionVisible={isPOISectionVisible}
          isLULCSectionVisible={isLULCSectionVisible}
          districts={districts}
          mandals={mandals}
          villages={villages}
          highlightDistrict={highlightDistrict}
          highlightMandal={highlightMandal}
          highlightVillage={highlightVillage}
          lulcToggles={lulcToggles}
          activeTool={activeTool}
        />

        <RightLayer
          settings={poiSettings}
          setSettings={setPoiSettings}
          isPOISectionVisible={isPOISectionVisible}
          setIsPOISectionVisible={setIsPOISectionVisible}
          lulcToggles={lulcToggles}
          setLulcToggles={setLulcToggles}
          isLULCSectionVisible={isLULCSectionVisible}
          setIsLULCSectionVisible={setIsLULCSectionVisible}
        />

        <div className="controls-container">
          {districts && mandals && villages && (
            <Search
              districts={districts}
              mandals={mandals}
              villages={villages}
              onHighlightDistrict={setHighlightDistrict}
              onHighlightMandal={setHighlightMandal}
              onHighlightVillage={setHighlightVillage}
              onToggle={setIsSearchExpanded}
            />
          )}
        </div>

        <ToolBar setActiveTool={setActiveTool} />
      </div>
    </div>
  );
}
