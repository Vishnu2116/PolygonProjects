import React, { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import * as turf from "@turf/turf";
import bbox from "@turf/bbox";

import "../styles/MapView.css";
import geojson from "../assets/joine3_lulc.js";
import anganwadi from "../assets/pois/AngawadiCenters.js";
import canal from "../assets/pois/Canal.js";
import forest from "../assets/pois/Forest.js";
import civilSupplies from "../assets/pois/CivilSupplies.js";
import muncipality from "../assets/pois/Muncipalities.js";
import hospital from "../assets/pois/Hospital.js";
import archMuse from "../assets/pois/ArchaeologyMuseums.js";
import drainage from "../assets/pois/Drainage.js";
import electricPoles from "../assets/pois/ElectricPoles.js";
import policeStation from "../assets/pois/PoliceStation.js";
import policeSurveillance from "../assets/pois/PoliceSurveillance.js";
import RailwayNetwork from "../assets/pois/RailwayNetwork.js";
import river from "../assets/pois/River.js";
import roads from "../assets/pois/Roads.js";

mapboxgl.accessToken =
  "pk.eyJ1IjoicmF5YXBhdGk0OSIsImEiOiJjbGVvMWp6OGIwajFpM3luNTBqZHhweXZzIn0.1r2DoIQ1Gf2K3e5WBgDNjA";

const allKeys = [
  "fid",
  "Remarks",
  "V_Name",
  "M_Name",
  "D_Name",
  "DMV_Code",
  "Parcel_num",
  "Shape_Leng",
  "Shape_Area",
  "Project",
  "AWC_Name",
  "Name",
  "Locality",
  "Status",
  "LULC_1",
];

const LULC_COLORS = {
  "Agriculture Land": "#1B5E20",
  Forest: "#1B3D1A",
  "Water Body": "#0D47A1",
  "Built Up": "#4A148C",
  Wastelands: "#3E2723",
  others: "#424242",
};

export default function MapView({
  onSelectPolygon,
  poiSettings,
  adminSettings,
  isAdminBoundariesVisible,
  isPOISectionVisible,
  isLULCSectionVisible,
  districts,
  mandals,
  villages,
  highlightDistrict,
  highlightMandal,
  highlightVillage,
  lulcToggles,
  activeTool,
  topographyVisible,
  showFmbLayer,
  cadastralVisible,
}) {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const draw = useRef(null);

  const DEFAULT_CENTER = [80.6063, 16.475];
  const DEFAULT_ZOOM = 13;

  const POI_LAYERS = [
    {
      id: "poi-anganwadi",
      data: anganwadi,
      setting: "anganwadi",
      color: "#FF5733",
    },
    { id: "poi-canal", data: canal, setting: "canal", color: "#2ECC71" },
    { id: "poi-forest", data: forest, setting: "forest", color: "#006400" },
    {
      id: "poi-civilsupplies",
      data: civilSupplies,
      setting: "civilSupplies",
      color: "#1E88E5",
    },
    {
      id: "poi-muncipalities",
      data: muncipality,
      setting: "muncipalities",
      color: "#F9A825",
    },
    {
      id: "poi-hospital",
      data: hospital,
      setting: "hospitals",
      color: "#C62828",
    },
    {
      id: "poi-archmuse",
      data: archMuse,
      setting: "archmuse",
      color: "#6D4C41",
    },
    {
      id: "poi-drainage",
      data: drainage,
      setting: "drainage",
      color: "#039BE5",
    },
    {
      id: "poi-electricpoles",
      data: electricPoles,
      setting: "electricpoles",
      color: "#F57C00",
    },
    {
      id: "poi-police",
      data: policeStation,
      setting: "policeSt",
      color: "#5E35B1",
    },
    {
      id: "poi-polsur",
      data: policeSurveillance,
      setting: "policeSur",
      color: "#00897B",
    },
    {
      id: "poi-railway",
      data: RailwayNetwork,
      setting: "railway",
      color: "#546E7A",
    },
    { id: "poi-river", data: river, setting: "river", color: "#00ACC1" },
    { id: "poi-roads", data: roads, setting: "roads", color: "#FF7043" },
  ];

  const BOUNDARY_LAYERS = [
    {
      id: "districts",
      data: districts,
      key: "district",
      nameField: "NAME",
      color: "#0a0a0a",
    },
    {
      id: "mandals",
      data: mandals,
      key: "mandal",
      nameField: "sdtname",
      color: "#DAA520",
    },
    {
      id: "villages",
      data: villages,
      key: "village",
      nameField: "NAME",
      color: "#444444",
    },
  ];

  useEffect(() => {
    if (!districts || !mandals || !villages || map.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: DEFAULT_CENTER,
      zoom: DEFAULT_ZOOM,
    });
    window.__MAP__ = map.current;

    map.current.addControl(new mapboxgl.NavigationControl());

    map.current.on("load", () => {
      //topography layer
      map.current.addSource("topography", {
        type: "raster",
        url: "mapbox://rayapati49.bkzen9ha",
        tileSize: 256,
        minzoom: 5,
        maxzoom: 15, // Adjust based on your MBTiles max zoom
      });

      map.current.addLayer({
        id: "topography-layer",
        type: "raster",
        source: "topography",
        layout: { visibility: topographyVisible ? "visible" : "none" },
      });

      //fmblayer
      map.current.addSource("fmb137", {
        type: "raster",
        url: "mapbox://rayapati49.0f2xgztl", // ✅ Use your actual tileset ID here
        tileSize: 256,
        minzoom: 10, // set based on your tileset
        maxzoom: 15,
      });

      // === Parcels
      map.current.addSource("parcels", { type: "geojson", data: geojson });
      map.current.addSource("highlight-parcel", {
        type: "geojson",
        data: { type: "FeatureCollection", features: [] },
      });

      map.current.addLayer({
        id: "parcels-fill",
        type: "fill",
        source: "parcels",
        paint: { "fill-color": "#0080ff", "fill-opacity": 0.3 },
        layout: { visibility: "none" }, // start hidden, controlled by toggle
      });

      map.current.addLayer({
        id: "parcels-outline",
        type: "line",
        source: "parcels",
        paint: { "line-color": "#003366", "line-width": 1.2 },
        layout: { visibility: "none" },
      });

      map.current.addLayer({
        id: "parcels-label",
        type: "symbol",
        source: "parcels",

        layout: {
          "text-field": ["get", "Parcel_num"],
          "text-size": 12,
          "text-offset": [0, 0.6],
          "text-anchor": "top",
          visibility: "none",
        },
        paint: {
          "text-color": "#111",
          "text-halo-color": "#fff",
          "text-halo-width": 1.2,
        },
      });

      map.current.addLayer({
        id: "highlight-parcel",
        type: "line",
        source: "highlight-parcel",
        paint: { "line-color": "#FF0000", "line-width": 3 },
      });

      // ✅ Parcel click logic (no PDF opening)
      map.current.on("click", "parcels-fill", (e) => {
        const feature = e.features[0];
        const area = turf.area(feature) * 0.000247105;

        map.current.getSource("highlight-parcel").setData({
          type: "FeatureCollection",
          features: [feature],
        });

        console.log({ ...feature.properties });
        onSelectPolygon({ ...feature.properties });

        new mapboxgl.Popup()
          .setLngLat(e.lngLat)
          .setHTML(
            `<strong>Parcel Number:</strong> ${
              feature.properties.Parcel_num
            }<br><strong>Area:</strong> ${area.toFixed(2)} acres`
          )
          .addTo(map.current);
      });

      map.current.on("click", (e) => {
        const features = map.current.queryRenderedFeatures(e.point, {
          layers: ["parcels-fill"],
        });
        if (!features.length) {
          map.current.getSource("highlight-parcel").setData({
            type: "FeatureCollection",
            features: [],
          });
        }
      });

      // === Boundaries
      BOUNDARY_LAYERS.forEach(({ id, data, nameField, color }) => {
        map.current.addSource(id, { type: "geojson", data });
        map.current.addLayer({
          id: `${id}-outline`,
          type: "line",
          source: id,
          paint: { "line-color": color, "line-width": 2 },
          layout: { visibility: "none" },
        });
        map.current.addLayer({
          id: `${id}-label`,
          type: "symbol",
          source: id,
          layout: {
            "text-field": ["get", nameField],
            "text-size": 12,
            "text-anchor": "center",
            visibility: "none",
          },
          paint: {
            "text-color": "#004466",
            "text-halo-color": "#fff",
            "text-halo-width": 1.2,
          },
        });
      });

      //search box highlight

      map.current.addSource("highlight-district", {
        type: "geojson",
        data: { type: "FeatureCollection", features: [] },
      });
      map.current.addLayer({
        id: "highlight-district",
        type: "line",
        source: "highlight-district",
        paint: { "line-color": "blue", "line-width": 3 },
      });

      map.current.addSource("highlight-mandal", {
        type: "geojson",
        data: { type: "FeatureCollection", features: [] },
      });
      map.current.addLayer({
        id: "highlight-mandal",
        type: "line",
        source: "highlight-mandal",
        paint: { "line-color": "red", "line-width": 3 },
      });

      map.current.addSource("highlight-village", {
        type: "geojson",
        data: { type: "FeatureCollection", features: [] },
      });

      map.current.addLayer({
        id: "highlight-village",
        type: "line",
        source: "highlight-village",
        paint: { "line-color": "#000000", "line-width": 3 },
      });

      // === POIs
      POI_LAYERS.forEach(({ id, data, color }) => {
        map.current.addSource(id, { type: "geojson", data });
        const type = data.features[0]?.geometry?.type;
        if (type === "Point") {
          map.current.addLayer({
            id,
            type: "circle",
            source: id,
            paint: {
              "circle-radius": 6,
              "circle-color": color,
              "circle-stroke-width": 1,
              "circle-stroke-color": "#fff",
            },
            layout: { visibility: "none" },
          });
        } else if (type === "LineString" || type === "MultiLineString") {
          map.current.addLayer({
            id,
            type: "line",
            source: id,
            paint: { "line-color": color, "line-width": 3 },
            layout: { visibility: "none" },
          });
        } else {
          map.current.addLayer({
            id,
            type: "fill",
            source: id,
            paint: { "fill-color": color, "fill-opacity": 0.6 },
            layout: { visibility: "none" },
          });
          map.current.addLayer({
            id: `${id}-outline`,
            type: "line",
            source: id,
            paint: { "line-color": color, "line-width": 2 },
            layout: { visibility: "none" },
          });
        }
      });

      map.current.addLayer(
        {
          id: "fmb137-layer",
          type: "raster",
          source: "fmb137",
          layout: { visibility: "none" },
        },
        map.current.getStyle().layers[map.current.getStyle().layers.length - 1]
          ?.id // on top
      );

      // === LULC
      map.current.addSource("lulc", { type: "geojson", data: geojson });
      Object.entries(LULC_COLORS).forEach(([category, color]) => {
        const layerId = `lulc-${category.replace(/\s+/g, "-").toLowerCase()}`;
        map.current.addLayer({
          id: layerId,
          type: "fill",
          source: "lulc",
          paint: { "fill-color": color, "fill-opacity": 0.9 },
          filter: ["==", ["get", "LULC_1"], category],
          layout: { visibility: "none" },
        });
      });

      draw.current = new MapboxDraw({ displayControlsDefault: false });
      map.current.addControl(draw.current);
      map.current.on("draw.create", () => {
        draw.current.changeMode("simple_select");
      });
    });
  }, [districts, mandals, villages, cadastralVisible]);

  useEffect(() => {
    if (!map.current) return;
    if (map.current.getLayer("parcels-fill")) {
      map.current.setLayoutProperty(
        "parcels-fill",
        "visibility",
        cadastralVisible ? "visible" : "none"
      );
    }
    if (map.current.getLayer("parcels-outline")) {
      map.current.setLayoutProperty(
        "parcels-outline",
        "visibility",
        cadastralVisible ? "visible" : "none"
      );
    }
    if (map.current.getLayer("parcels-label")) {
      map.current.setLayoutProperty(
        "parcels-label",
        "visibility",
        cadastralVisible ? "visible" : "none"
      );
    }

    // === Admin boundary layer visibility
    BOUNDARY_LAYERS.forEach(({ id, key }) => {
      const outlineLayer = `${id}-outline`;
      const labelLayer = `${id}-label`;

      if (
        map.current.getLayer(outlineLayer) &&
        map.current.getLayer(labelLayer)
      ) {
        const visibility =
          isAdminBoundariesVisible && adminSettings[key] ? "visible" : "none";
        map.current.setLayoutProperty(outlineLayer, "visibility", visibility);
        map.current.setLayoutProperty(labelLayer, "visibility", visibility);
      }
    });

    // === POI layer visibility
    POI_LAYERS.forEach(({ id, setting }) => {
      const visibility =
        isPOISectionVisible && poiSettings[setting] ? "visible" : "none";
      if (map.current.getLayer(id)) {
        map.current.setLayoutProperty(id, "visibility", visibility);
      }
      if (map.current.getLayer(`${id}-outline`)) {
        map.current.setLayoutProperty(
          `${id}-outline`,
          "visibility",
          visibility
        );
      }
    });

    // LULC toggles
    Object.keys(lulcToggles).forEach((category) => {
      const layerId = `lulc-${category.replace(/\s+/g, "-").toLowerCase()}`;
      const visibility =
        isLULCSectionVisible && lulcToggles[category] ? "visible" : "none";
      if (map.current.getLayer(layerId)) {
        map.current.setLayoutProperty(layerId, "visibility", visibility);
      }
    });

    // Zoom logic

    const shouldZoomToState =
      isAdminBoundariesVisible &&
      (adminSettings.district || adminSettings.mandal || adminSettings.village);
    // console.log("adminSettings:", adminSettings);
    // console.log("villages.features:", villages?.features?.length);
    // console.log("Sample village:", villages.features?.[0]);

    if (shouldZoomToState) {
      let features = [];
      if (adminSettings.district)
        features = features.concat(districts.features);
      if (adminSettings.mandal) features = features.concat(mandals.features);
      if (adminSettings.village) {
        if (villages?.features?.length) {
          const villageBBox = bbox({
            type: "FeatureCollection",
            features: villages.features,
          });
          map.current.fitBounds(villageBBox, { padding: 40 });
        }
      }

      if (features.length) {
        const stateBBox = bbox({ type: "FeatureCollection", features });
        map.current.fitBounds(stateBBox, { padding: 40 });
      }
    } else {
      map.current.flyTo({ center: DEFAULT_CENTER, zoom: DEFAULT_ZOOM });
    }

    if (map.current.getLayer("topography-layer")) {
      map.current.setLayoutProperty(
        "topography-layer",
        "visibility",
        topographyVisible ? "visible" : "none"
      );
    }
    if (map.current.getLayer("fmb137-layer")) {
      map.current.setLayoutProperty(
        "fmb137-layer",
        "visibility",
        showFmbLayer ? "visible" : "none"
      );
    }
  }, [
    poiSettings,
    isPOISectionVisible,
    adminSettings, // ✅ add this
    isAdminBoundariesVisible, // ✅ add this
    lulcToggles,
    isLULCSectionVisible,
    districts,
    mandals,
    villages,
    topographyVisible,
    showFmbLayer,
    cadastralVisible,
  ]);

  useEffect(() => {
    if (!map.current) return;

    const findFeature = (collection, name, key) =>
      collection?.features?.find(
        (f) => f.properties?.[key]?.toLowerCase() === name?.toLowerCase()
      );

    const districtFeature = findFeature(districts, highlightDistrict, "NAME");
    const mandalFeature = findFeature(mandals, highlightMandal, "sdtname");
    const villageFeature = findFeature(villages, highlightVillage, "Village");

    if (map.current.getSource("highlight-district")) {
      map.current.getSource("highlight-district").setData({
        type: "FeatureCollection",
        features: districtFeature ? [districtFeature] : [],
      });
    }

    if (map.current.getSource("highlight-mandal")) {
      map.current.getSource("highlight-mandal").setData({
        type: "FeatureCollection",
        features: mandalFeature ? [mandalFeature] : [],
      });
    }

    if (map.current.getSource("highlight-village")) {
      map.current.getSource("highlight-village").setData({
        type: "FeatureCollection",
        features: villageFeature ? [villageFeature] : [],
      });
    }

    if (villageFeature) {
      map.current.fitBounds(turf.bbox(villageFeature), { padding: 40 });
    } else if (mandalFeature) {
      map.current.fitBounds(turf.bbox(mandalFeature), { padding: 40 });
    } else if (districtFeature) {
      map.current.fitBounds(turf.bbox(districtFeature), { padding: 40 });
    } else {
      map.current.flyTo({ center: DEFAULT_CENTER, zoom: DEFAULT_ZOOM });
    }
  }, [highlightDistrict, highlightMandal, highlightVillage]);

  useEffect(() => {
    if (!map.current || !draw.current) return;

    // 🧼 Always reset mode before switching
    const drawMode =
      activeTool === "line"
        ? "draw_line_string"
        : activeTool === "polygon"
        ? "draw_polygon"
        : "simple_select";

    const currentMode = draw.current.getMode();

    // 🧠 Always reset before applying tool (even if it’s already selected)
    if (currentMode !== drawMode) {
      draw.current.changeMode("simple_select"); // reset everything
      setTimeout(() => {
        draw.current.changeMode(drawMode);
      }, 50);
    }

    // ✅ Other tools
    if (activeTool === "print") {
      window.print();
    } else if (activeTool === "pan") {
      map.current.boxZoom.enable();
      draw.current.changeMode("simple_select");
    } else if (activeTool === "search") {
      console.log("Search tool activated");
      draw.current.changeMode("simple_select");
    }
  }, [activeTool]);

  useEffect(() => {
    if (!map.current) return;

    if (adminSettings.village) {
      if (villages?.features?.length) {
        const villageBBox = bbox({
          type: "FeatureCollection",
          features: villages.features,
        });
        map.current.fitBounds(villageBBox, { padding: 40 });
      }
    }
  }, [adminSettings.village]);

  return <div ref={mapContainer} className="map-container" />;
}
