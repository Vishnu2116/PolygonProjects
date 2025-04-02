import React, { useMemo, useEffect, useCallback } from "react";
import LULC from "../../assets/LULC";
import "../../styles/Layers.css";
import AdministrativeBoundaries from "./AdministrativeBoundaries";
import PointsofInterest from "./PointsofInterest";
import Lulc from "./Lulc";

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
        settings={settings}
        toggleSetting={toggleSetting}
        isAdminBoundariesVisible={isAdminBoundariesVisible}
        setIsAdminBoundariesVisible={setIsAdminBoundariesVisible}
      />
      <PointsofInterest
        settings={settings}
        toggleSetting={toggleSetting}
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
    </div>
  );
}
