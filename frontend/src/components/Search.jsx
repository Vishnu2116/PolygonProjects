import React, { useMemo, useRef, useState, useEffect } from "react";
import "../styles/Search.css";

export default function Search({
  districts,
  mandals,
  villages,
  onHighlightDistrict,
  onHighlightMandal,
  onHighlightVillage,
  onToggle,
}) {
  const districtDropdownRef = useRef(null);
  const mandalDropdownRef = useRef(null);
  const villageDropdownRef = useRef(null);
  const searchContainerRef = useRef(null);
  const [districtSearchTerm, setDistrictSearchTerm] = useState("");
  const [mandalSearchTerm, setMandalSearchTerm] = useState("");
  const [villageSearchTerm, setVillageSearchTerm] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedMandal, setSelectedMandal] = useState("");
  const [selectedVillage, setSelectedVillage] = useState("");
  const [showDistrictDropdown, setShowDistrictDropdown] = useState(false);
  const [showMandalDropdown, setShowMandalDropdown] = useState(false);
  const [showVillageDropdown, setShowVillageDropdown] = useState(false);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);

 // Remove the duplicate handleSearchToggle and keep only this one:
const handleSearchToggle = (e) => {
    e.stopPropagation(); // Prevent event bubbling
    const newState = !isSearchExpanded;
    setIsSearchExpanded(newState);
    if (onToggle) onToggle(newState); // Notify parent component
  };

  const normalize = (str) =>
    str?.toLowerCase().replace(/\s+/g, " ").trim() || "";

  // Get unique districts from villages data
  const districtList = useMemo(() => {
    if (!villages?.features) return [];

    const uniqueDistricts = new Set();
    villages.features.forEach((feature) => {
      if (feature.properties?.District) {
        uniqueDistricts.add(feature.properties.District);
      }
    });

    return Array.from(uniqueDistricts).map((district) => ({
      original: district,
      normalized: normalize(district),
    }));
  }, [villages]);

  // Get unique mandals from villages data
  const mandalList = useMemo(() => {
    if (!villages?.features) return [];

    const uniqueMandals = new Map();
    villages.features.forEach((feature) => {
      const mandal = feature.properties?.Mandal;
      const district = feature.properties?.District;

      if (mandal && district) {
        const key = `${district}-${mandal}`;
        if (!uniqueMandals.has(key)) {
          uniqueMandals.set(key, {
            original: mandal,
            normalized: normalize(mandal),
            district: district,
          });
        }
      }
    });

    return Array.from(uniqueMandals.values());
  }, [villages]);

  // Get unique villages from villages data
  const villageList = useMemo(() => {
    if (!villages?.features) return [];

    const uniqueVillages = new Map();
    villages.features.forEach((feature) => {
      const village = feature.properties?.Village;
      const mandal = feature.properties?.Mandal;
      const district = feature.properties?.District;

      if (village && mandal && district) {
        const key = `${district}-${mandal}-${village}`;
        if (!uniqueVillages.has(key)) {
          uniqueVillages.set(key, {
            original: village,
            normalized: normalize(village),
            mandal: mandal,
            district: district,
          });
        }
      }
    });

    return Array.from(uniqueVillages.values());
  }, [villages]);

  const filteredDistricts = useMemo(() => {
    const term = normalize(districtSearchTerm);
    return districtList
      .filter((d) => term === "" || d.normalized.includes(term))
      .map((d) => d.original);
  }, [districtSearchTerm, districtList]);

  const filteredMandals = useMemo(() => {
    const term = normalize(mandalSearchTerm);
    return mandalList
      .filter(
        (m) =>
          (!selectedDistrict ||
            normalize(m.district) === normalize(selectedDistrict)) &&
          (term === "" || m.normalized.includes(term))
      )
      .map((m) => ({
        name: m.original,
        district: m.district,
      }));
  }, [mandalSearchTerm, selectedDistrict, mandalList]);

  const filteredVillages = useMemo(() => {
    const term = normalize(villageSearchTerm);
    return villageList
      .filter(
        (v) =>
          (!selectedDistrict ||
            normalize(v.district) === normalize(selectedDistrict)) &&
          (!selectedMandal ||
            normalize(v.mandal) === normalize(selectedMandal)) &&
          (term === "" || v.normalized.includes(term))
      )
      .map((v) => ({
        name: v.original,
        mandal: v.mandal,
        district: v.district,
      }));
  }, [villageSearchTerm, selectedDistrict, selectedMandal, villageList]);

  // Handle clicks outside of dropdowns
  useEffect(() => {
    function handleClickOutside(event) {
        if (
          searchContainerRef.current &&
          !searchContainerRef.current.contains(event.target)&&
          !document.querySelector('.records-sidebar')?.contains(event.target)   
        ) {
          // Only auto-close if nothing is selected AND we're not clicking on the header
          if (!selectedDistrict && !selectedMandal && !selectedVillage) {
            setIsSearchExpanded(false);
            if (onToggle) onToggle(false);
          }
        }
      
      if (
        districtDropdownRef.current &&
        !districtDropdownRef.current.contains(event.target)
      ) {
        setShowDistrictDropdown(false);
      }
      if (
        mandalDropdownRef.current &&
        !mandalDropdownRef.current.contains(event.target)
      ) {
        setShowMandalDropdown(false);
      }
      if (
        villageDropdownRef.current &&
        !villageDropdownRef.current.contains(event.target)
      ) {
        setShowVillageDropdown(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [selectedDistrict, selectedMandal, selectedVillage]);

  const handleDistrictSelect = (district) => {
    setSelectedDistrict(district);
    setDistrictSearchTerm(district);
    setSelectedMandal("");
    setSelectedVillage("");
    setShowDistrictDropdown(false);
    if (onHighlightDistrict) onHighlightDistrict(district);
    if (onHighlightMandal) onHighlightMandal("");
    if (onHighlightVillage) onHighlightVillage("");
  };

  const handleMandalSelect = (mandal) => {
    setSelectedMandal(mandal.name);
    setMandalSearchTerm(mandal.name);
    setSelectedDistrict(mandal.district);
    setDistrictSearchTerm(mandal.district);
    setSelectedVillage("");
    setShowMandalDropdown(false);
    if (onHighlightMandal) onHighlightMandal(mandal.name);
    if (onHighlightDistrict) onHighlightDistrict(mandal.district);
    if (onHighlightVillage) onHighlightVillage("");
  };

  const handleVillageSelect = (village) => {
    setSelectedVillage(village.name);
    setVillageSearchTerm(village.name);
    setSelectedMandal(village.mandal);
    setMandalSearchTerm(village.mandal);
    setSelectedDistrict(village.district);
    setDistrictSearchTerm(village.district);
    setShowVillageDropdown(false);
    if (onHighlightVillage) onHighlightVillage(village.name);
    if (onHighlightMandal) onHighlightMandal(village.mandal);
    if (onHighlightDistrict) onHighlightDistrict(village.district);
  };

//   const handleSearchToggle = () => {
//     setIsSearchExpanded(!isSearchExpanded);
//   };

  const clearAll = () => {
    setDistrictSearchTerm("");
    setSelectedDistrict("");
    setMandalSearchTerm("");
    setSelectedMandal("");
    setVillageSearchTerm("");
    setSelectedVillage("");
    if (onHighlightDistrict) onHighlightDistrict("");
    if (onHighlightMandal) onHighlightMandal("");
    if (onHighlightVillage) onHighlightVillage("");
  };

  // Function to render dropdown items
  const renderDropdownItems = (items, handleSelect) => {
    return items.map((item, index) => {
      if (typeof item === 'string') {
        return (
          <div
            key={index}
            className="dropdown-item"
            onClick={() => handleSelect(item)}
          >
            {item}
          </div>
        );
      } else {
        return (
          <div
            key={index}
            className="dropdown-item"
            onClick={() => handleSelect(item)}
          >
            <span className="search-item-primary">{item.name}</span>
            <span className="search-item-secondary">
              {item.mandal ? `${item.mandal}, ` : ''}{item.district} {!item.mandal && 'District'}
            </span>
          </div>
        );
      }
    });
  };

  const getSelectedLocationDisplay = () => {
    if (selectedVillage) {
      return `${selectedVillage}, ${selectedMandal}, ${selectedDistrict}`;
    } else if (selectedMandal) {
      return `${selectedMandal}, ${selectedDistrict}`;
    } else if (selectedDistrict) {
      return selectedDistrict;
    }
    return "Search Location";
  };

  return (
    <div className="search-container" ref={searchContainerRef}>
      <div 
        className={`search-header ${(selectedDistrict || selectedMandal || selectedVillage) ? 'with-selection' : ''}`}
        onClick={handleSearchToggle}
      >
        <div className="search-title">{getSelectedLocationDisplay()}</div>
        <div className="search-toggle-icon">
          {isSearchExpanded ? '▲' : '▼'}
        </div>
        {(selectedDistrict || selectedMandal || selectedVillage) && (
          <button className="clear-all-button" onClick={(e) => {
            e.stopPropagation();
            clearAll();
          }}>
            Clear
          </button>
        )}
      </div>

      {isSearchExpanded && (
        <div className="search-content">
          {/* District Search */}
          <div className="section search-section ">
            <div className="search-input-container" ref={districtDropdownRef}>
              <input
                type="text"
                className="search-input"
                placeholder="Search Districts"
                value={districtSearchTerm}
                onChange={(e) => {
                  const val = e.target.value;
                  setDistrictSearchTerm(val);
                  setShowDistrictDropdown(true);
                  if (val.trim() === "") {
                    setSelectedDistrict("");
                    if (onHighlightDistrict) onHighlightDistrict("");
                  }
                }}
                onClick={() => setShowDistrictDropdown(true)}
              />
              {districtSearchTerm && (
                <button
                  className="clear-button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setDistrictSearchTerm("");
                    setSelectedDistrict("");
                    if (onHighlightDistrict) onHighlightDistrict("");
                  }}
                >
                  ✕
                </button>
              )}
              {showDistrictDropdown && filteredDistricts.length > 0 && (
                <div className="dropdown-wrapper dropdown-no-height">
                  {renderDropdownItems(filteredDistricts, handleDistrictSelect)}
                </div>
              )}
            </div>
          </div>

          {/* Mandal Search */}
          <div className="section search-section">
            <div className="search-input-container" ref={mandalDropdownRef}>
              <input
                type="text"
                className="search-input"
                placeholder="Search Mandals"
                value={mandalSearchTerm}
                onChange={(e) => {
                  const val = e.target.value;
                  setMandalSearchTerm(val);
                  setShowMandalDropdown(true);
                  if (val.trim() === "") {
                    setSelectedMandal("");
                    if (onHighlightMandal) onHighlightMandal("");
                  }
                }}
                onClick={() => setShowMandalDropdown(true)}
              />
              {mandalSearchTerm && (
                <button
                  className="clear-button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setMandalSearchTerm("");
                    setSelectedMandal("");
                    if (onHighlightMandal) onHighlightMandal("");
                  }}
                >
                  ✕
                </button>
              )}
              {showMandalDropdown && filteredMandals.length > 0 && (
                <div className="dropdown-wrapper dropdown-no-height">
                  {renderDropdownItems(filteredMandals, handleMandalSelect)}
                </div>
              )}
            </div>
          </div>

          {/* Village Search */}
          <div className="section search-section pdd__">
            <div className="search-input-container" ref={villageDropdownRef}>
              <input
                type="text"
                className="search-input"
                placeholder="Search Villages"
                value={villageSearchTerm}
                onChange={(e) => {
                  const val = e.target.value;
                  setVillageSearchTerm(val);
                  setShowVillageDropdown(true);
                  if (val.trim() === "") {
                    setSelectedVillage("");
                    if (onHighlightVillage) onHighlightVillage("");
                  }
                }}
                onClick={() => setShowVillageDropdown(true)}
              />
              {villageSearchTerm && (
                <button
                  className="clear-button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setVillageSearchTerm("");
                    setSelectedVillage("");
                    if (onHighlightVillage) onHighlightVillage("");
                  }}
                >
                  ✕
                </button>
              )}
              {showVillageDropdown && filteredVillages.length > 0 && (
                <div className="dropdown-wrapper dropdown-no-height">
                  {renderDropdownItems(filteredVillages, handleVillageSelect)}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
