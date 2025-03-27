import React, {
  useState,
  useMemo,
  useCallback,
  useEffect,
  useRef,
} from "react";
import { FixedSizeList as List } from "react-window";
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
  isPOISectionVisible,
  setIsPOISectionVisible,
  districts,
  mandals,
  onHighlightDistrict,
  onHighlightMandal,
  onHighlightVillage,
  lulcToggles,
  setLulcToggles,
  isLULCSectionVisible,
  setIsLULCSectionVisible,
}) {
  const [districtSearchTerm, setDistrictSearchTerm] = useState("");
  const [mandalSearchTerm, setMandalSearchTerm] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedMandal, setSelectedMandal] = useState("");
  const [isDistrictDropdownOpen, setIsDistrictDropdownOpen] = useState(false);
  const [isMandalDropdownOpen, setIsMandalDropdownOpen] = useState(false);

  const districtDropdownRef = useRef(null);
  const mandalDropdownRef = useRef(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        districtDropdownRef.current &&
        !districtDropdownRef.current.contains(e.target)
      ) {
        setIsDistrictDropdownOpen(false);
      }
      if (
        mandalDropdownRef.current &&
        !mandalDropdownRef.current.contains(e.target)
      ) {
        setIsMandalDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
  }, [lulcCategories]);

  const toggleSetting = useCallback(
    (key) => setSettings((prev) => ({ ...prev, [key]: !prev[key] })),
    [setSettings]
  );

  const toggleLULCCategory = useCallback((category) => {
    setLulcToggles((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  }, []);

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
      <button
        className={`toggle ${lulcToggles[category] ? "toggle-active" : ""}`}
        onClick={() => toggleLULCCategory(category)}
        aria-checked={lulcToggles[category]}
        role="switch"
      >
        <span className="toggle-thumb"></span>
      </button>
      <span className="toggle-label">{category}</span>
      <div
        className="lulc-color-box"
        style={{ backgroundColor: LULC_COLORS[category] || "#ccc" }}
      ></div>
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
        <div
          className="search-container district-search"
          ref={districtDropdownRef}
        >
          <input
            type="text"
            className="search-input"
            placeholder="Search Districts"
            value={districtSearchTerm}
            onChange={(e) => {
              const val = e.target.value;
              setDistrictSearchTerm(val);
              if (val.trim() === "") {
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
                onHighlightDistrict("");
                onHighlightMandal("");
              }}
            >
              ✕
            </button>
          )}
          {isDistrictDropdownOpen && (
            <div className="dropdown-wrapper">
              {filteredDistricts.length ? (
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
        <div className="search-container mandal-search" ref={mandalDropdownRef}>
          <input
            type="text"
            className="search-input"
            placeholder="Search Mandals"
            value={mandalSearchTerm}
            onChange={(e) => {
              const val = e.target.value;
              setMandalSearchTerm(val);
              if (val.trim() === "") {
                setSelectedMandal("");
                onHighlightMandal("");
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
                onHighlightMandal("");
              }}
            >
              ✕
            </button>
          )}
          {isMandalDropdownOpen && (
            <div className="dropdown-wrapper">
              {filteredMandals.length ? (
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
