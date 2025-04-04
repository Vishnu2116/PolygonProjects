import React, { useMemo, useEffect, useCallback } from "react";
import LULC from "../../assets/LULC";
import "../../styles/Layers.css";
import AdministrativeBoundaries from "./AdministrativeBoundaries";
import Topography from "./Topography";
import PointsofInterest from "./PointsofInterest";
import Lulc from "./Lulc";
import Cadastral from "./Cadastral";

export default function RightLayer({
  settings,
  setSettings,
  adminSettings,
  setAdminSettings,
  isAdminBoundariesVisible,
  setIsAdminBoundariesVisible,
  isPOISectionVisible,
  setIsPOISectionVisible,
  lulcToggles,
  setLulcToggles,
  isLULCSectionVisible,
  setIsLULCSectionVisible,
  topographyVisible,
  setTopographyVisible,
  cadastralVisible,
  setCadastralVisible,
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

  const toggleLULCCategory = useCallback(
    (category) => {
      setLulcToggles((prev) => ({
        ...prev,
        [category]: !prev[category],
      }));
    },
    [setLulcToggles]
  );

  return (
    <div className="layers-panel">
      <h3 className="panel-title">Layers</h3>
      <AdministrativeBoundaries
        settings={adminSettings} // ✅ use correct state
        toggleSetting={(key) =>
          setAdminSettings((prev) => ({
            ...prev,
            [key]: !prev[key],
          }))
        }
        setSettings={setAdminSettings}
        isAdminBoundariesVisible={isAdminBoundariesVisible}
        setIsAdminBoundariesVisible={setIsAdminBoundariesVisible}
      />
      <PointsofInterest
        settings={settings} // poiSettings
        toggleSetting={(key) =>
          setSettings((prev) => ({
            ...prev,
            [key]: !prev[key],
          }))
        }
        isPOISectionVisible={isPOISectionVisible}
        setIsPOISectionVisible={setIsPOISectionVisible}
      />
      <Lulc
        lulcToggles={lulcToggles}
        toggleLULCCategory={toggleLULCCategory}
        isLULCSectionVisible={isLULCSectionVisible}
        setIsLULCSectionVisible={setIsLULCSectionVisible}
        lulcCategories={lulcCategories}
      />
      <Cadastral
        cadastralVisible={cadastralVisible}
        setCadastralVisible={setCadastralVisible}
      />

      <Topography
        topographyVisible={topographyVisible}
        setTopographyVisible={setTopographyVisible}
      />
    </div>
  );
}
