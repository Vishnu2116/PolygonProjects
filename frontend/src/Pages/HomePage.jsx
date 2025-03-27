import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import MapView from "../components/MapView";
import RightLayer from "../components/RightLayer";
import RecordDetails from "../components/Records/RecordDetails";
import "../styles/HomePage.css";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5001";

export default function HomePage({ onLogout }) {
  const [selectedFeature, setSelectedFeature] = useState(null);
  const [isPOISectionVisible, setIsPOISectionVisible] = useState(true);
  const [districts, setDistricts] = useState(null);
  const [mandals, setMandals] = useState(null);
  const [highlightDistrict, setHighlightDistrict] = useState(null);
  const [highlightMandal, setHighlightMandal] = useState(null);

  const [poiSettings, setPoiSettings] = useState({
    district: false,
    mandal: false,
    village: false,
    revenue: false,
    enjoyment: false,
    landClass: false,
    boundaryPoints: false,
    heatmap: false,
    anganwadi: false,
    canal: false,
    forest: false,
    hospital: false,
    muncipality: false,
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
        const districtRes = await fetch("/District.json");
        const mandalRes = await fetch("/Mandal.json");
        const districtData = await districtRes.json();
        const mandalData = await mandalRes.json();
        setDistricts(districtData);
        setMandals(mandalData);
      } catch (error) {
        console.error("Error loading GeoJSON:", error);
      }
    };
    loadGeoJSON();
  }, []);

  return (
    <div className="app-container">
      <Navbar onLogout={handleLogout} />
      <div className="map-container">
        {selectedFeature && (
          <RecordDetails
            data={selectedFeature}
            onClose={() => setSelectedFeature(null)}
          />
        )}
        <MapView
          onSelectPolygon={(props) => setSelectedFeature(props)}
          poiSettings={poiSettings}
          isPOISectionVisible={isPOISectionVisible}
          districts={districts}
          mandals={mandals}
          highlightDistrict={highlightDistrict}
          highlightMandal={highlightMandal}
        />
        <RightLayer
          settings={poiSettings}
          setSettings={setPoiSettings}
          isPOISectionVisible={isPOISectionVisible}
          setIsPOISectionVisible={setIsPOISectionVisible}
          districts={districts}
          mandals={mandals}
          onHighlightDistrict={setHighlightDistrict} // ✅ Fixed
          onHighlightMandal={setHighlightMandal} // ✅ Fixed
        />
      </div>
    </div>
  );
}
