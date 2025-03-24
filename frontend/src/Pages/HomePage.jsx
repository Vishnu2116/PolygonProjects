import React, { useState } from "react";
import Navbar from "../components/Navbar";
import MapView from "../components/MapView";
import RightLayer from "../components/RightLayer";
import RecordDetails from "../components/Records/RecordDetails";
import "../styles/HomePage.css";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5001";

export default function HomePage({ onLogout }) {
  const [selectedFeature, setSelectedFeature] = useState(null);
  const [isPOISectionVisible, setIsPOISectionVisible] = useState(true);

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
        />
        <RightLayer
          settings={poiSettings}
          setSettings={setPoiSettings}
          isPOISectionVisible={isPOISectionVisible}
          setIsPOISectionVisible={setIsPOISectionVisible}
        />
      </div>
    </div>
  );
}
