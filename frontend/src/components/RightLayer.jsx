import React, { useState, useMemo, useCallback, useEffect } from "react";
import { FixedSizeList as List } from "react-window";
import "../styles/RightLayer.css";

export default function RightLayer({
  settings,
  setSettings,
  isPOISectionVisible,
  setIsPOISectionVisible,
  districts,
  mandals,
  onHighlightDistrict,
  onHighlightMandal,
}) {
  const [districtSearchTerm, setDistrictSearchTerm] = useState("");
  const [mandalSearchTerm, setMandalSearchTerm] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedMandal, setSelectedMandal] = useState("");
  const [isDistrictDropdownOpen, setIsDistrictDropdownOpen] = useState(false);
  const [isMandalDropdownOpen, setIsMandalDropdownOpen] = useState(false);

  const normalize = (str) => str.toLowerCase().replace(/\s+/g, " ").trim();

  const districtList = useMemo(() => {
    return (districts?.features || [])
      .filter((f) => f.properties?.NAME)
      .map((f) => ({
        original: f.properties.NAME,
        normalized: normalize(f.properties.NAME),
      }));
  }, [districts]);

  const mandalList = useMemo(() => {
    return (mandals?.features || [])
      .filter((f) => f.properties?.sdtname && f.properties?.dtname)
      .map((f) => ({
        original: f.properties.sdtname,
        normalized: normalize(f.properties.sdtname),
        district: f.properties.dtname,
      }));
  }, [mandals]);

  const filteredDistricts = useMemo(() => {
    const term = normalize(districtSearchTerm);
    return districtList
      .filter((d) => d.normalized.includes(term))
      .map((d) => d.original);
  }, [districtSearchTerm, districtList]);

  const filteredMandals = useMemo(() => {
    const term = normalize(mandalSearchTerm);
    return mandalList
      .filter(
        (m) =>
          (!selectedDistrict ||
            normalize(m.district) === normalize(selectedDistrict)) &&
          m.normalized.includes(term)
      )
      .map((m) => ({
        name: m.original,
        district: m.district,
      }));
  }, [mandalSearchTerm, selectedDistrict, mandalList]);

  useEffect(() => {
    const closeDropdowns = (e) => {
      const containers = document.querySelectorAll(".search-container");
      containers.forEach((c) => {
        if (!c.contains(e.target)) {
          if (c.classList.contains("district-search"))
            setIsDistrictDropdownOpen(false);
          if (c.classList.contains("mandal-search"))
            setIsMandalDropdownOpen(false);
        }
      });
    };
    document.addEventListener("mousedown", closeDropdowns);
    return () => document.removeEventListener("mousedown", closeDropdowns);
  }, []);

  const toggleSetting = useCallback(
    (key) => setSettings((prev) => ({ ...prev, [key]: !prev[key] })),
    [setSettings]
  );

  const handleDistrictSelect = (district) => {
    setSelectedDistrict(district);
    setDistrictSearchTerm(district);
    setSelectedMandal("");
    setIsDistrictDropdownOpen(false);
    if (onHighlightDistrict) onHighlightDistrict(district);
    if (onHighlightMandal) onHighlightMandal("");
  };

  const handleMandalSelect = (mandal) => {
    setSelectedMandal(mandal.name);
    setMandalSearchTerm(mandal.name);
    setSelectedDistrict(mandal.district);
    setDistrictSearchTerm(mandal.district);
    setIsMandalDropdownOpen(false);
    if (onHighlightMandal) onHighlightMandal(mandal.name);
    if (onHighlightDistrict) onHighlightDistrict(mandal.district);
  };

  const renderToggle = (label, key) => (
    <div className="toggle-container">
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

  return (
    <div className="layers-panel">
      {(selectedDistrict || selectedMandal) && (
        <div className="selected-location">
          {selectedMandal
            ? `${selectedMandal}, ${selectedDistrict}`
            : selectedDistrict}
        </div>
      )}

      <h3 className="panel-title">Layers</h3>

      <div className="section search-section">
        <h4 className="section-title">District Search</h4>
        <div className="search-container district-search">
          <input
            type="text"
            placeholder="Search Districts"
            className="search-input"
            value={districtSearchTerm}
            onChange={(e) => {
              const value = e.target.value;
              setDistrictSearchTerm(value);
              if (value.trim() === "") {
                setSelectedDistrict("");
                if (onHighlightDistrict) onHighlightDistrict("");
              }
            }}
            onFocus={() => setIsDistrictDropdownOpen(true)}
          />

          {districtSearchTerm && (
            <button
              className="clear-button"
              onClick={() => {
                setDistrictSearchTerm("");
                setSelectedDistrict("");
                setMandalSearchTerm("");
                setSelectedMandal("");
                if (onHighlightDistrict) onHighlightDistrict("");
                if (onHighlightMandal) onHighlightMandal("");
              }}
            >
              ✕
            </button>
          )}

          {isDistrictDropdownOpen && (
            <div className="dropdown-wrapper">
              {filteredDistricts.length > 0 ? (
                <List
                  height={200}
                  itemCount={filteredDistricts.length}
                  itemSize={35}
                  width={"100%"}
                >
                  {({ index, style }) => (
                    <div
                      style={style}
                      className="district-dropdown-item"
                      onClick={() =>
                        handleDistrictSelect(filteredDistricts[index])
                      }
                    >
                      {filteredDistricts[index]}
                    </div>
                  )}
                </List>
              ) : (
                <div className="district-dropdown no-results">
                  No districts found
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="section search-section">
        <h4 className="section-title">Mandal Search</h4>
        <div className="search-container mandal-search">
          <input
            type="text"
            placeholder="Search Mandals"
            className="search-input"
            value={mandalSearchTerm}
            onChange={(e) => {
              const value = e.target.value;
              setMandalSearchTerm(value);
              if (value.trim() === "") {
                setSelectedMandal("");
                if (onHighlightMandal) onHighlightMandal("");
              }
            }}
            onFocus={() => setIsMandalDropdownOpen(true)}
          />

          {mandalSearchTerm && (
            <button
              className="clear-button"
              onClick={() => {
                setMandalSearchTerm("");
                setSelectedMandal("");
                if (onHighlightMandal) onHighlightMandal("");
              }}
            >
              ✕
            </button>
          )}

          {isMandalDropdownOpen && (
            <div className="dropdown-wrapper">
              {filteredMandals.length > 0 ? (
                <List
                  height={200}
                  itemCount={filteredMandals.length}
                  itemSize={45}
                  width={"100%"}
                >
                  {({ index, style }) => (
                    <div
                      style={style}
                      className="district-dropdown-item"
                      onClick={() => handleMandalSelect(filteredMandals[index])}
                    >
                      <span className="mandal-name">
                        {filteredMandals[index].name}
                      </span>
                      <span className="mandal-district-info">
                        {filteredMandals[index].district} District
                      </span>
                    </div>
                  )}
                </List>
              ) : (
                <div className="district-dropdown no-results">
                  No mandals found
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="section">
        <h4 className="section-title">Administrative boundaries</h4>
        <div className="toggle-group">
          {renderToggle("District boundaries", "district")}
          {renderToggle("Mandal boundaries", "mandal")}
          {renderToggle("Village boundaries", "village")}
        </div>
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
          <div className="toggle-group">
            {renderToggle("Anganwadi Centers", "anganwadi")}
            {renderToggle("Canal", "canal")}
            {renderToggle("Forest", "forest")}
          </div>
        )}
      </div>
    </div>
  );
}
