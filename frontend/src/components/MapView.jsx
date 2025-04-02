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

const seenParcels = new Set();
const uniqueFeatures = [];

for (const feature of geojson.features) {
  const parcelNum = String(feature.properties?.Parcel_num || "").trim();
  if (parcelNum && !seenParcels.has(parcelNum)) {
    seenParcels.add(parcelNum);
    uniqueFeatures.push(feature);
  }
}

const deduplicatedGeoJSON = {
  ...geojson,
  features: uniqueFeatures,
};

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

    map.current.addControl(new mapboxgl.NavigationControl());

    map.current.on("load", () => {
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
      });
      map.current.addLayer({
        id: "parcels-outline",
        type: "line",
        source: "parcels",
        paint: { "line-color": "#003366", "line-width": 1.2 },
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

      map.current.on("click", "parcels-fill", (e) => {
        const feature = e.features[0];
        const area = turf.area(feature) * 0.000247105;

        map.current.getSource("highlight-parcel").setData({
          type: "FeatureCollection",
          features: [feature],
        });

        onSelectPolygon(feature.properties);

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
  }, [districts, mandals, villages]);

  useEffect(() => {
    if (!map.current) return;

    // Admin boundary layer toggles
    BOUNDARY_LAYERS.forEach(({ id, key }) => {
      const visibility = poiSettings[key] ? "visible" : "none";
      if (map.current.getLayer(`${id}-outline`)) {
        map.current.setLayoutProperty(
          `${id}-outline`,
          "visibility",
          visibility
        );
      }
      if (map.current.getLayer(`${id}-label`)) {
        map.current.setLayoutProperty(`${id}-label`, "visibility", visibility);
      }
    });

    // POI toggles
    POI_LAYERS.forEach(({ id, setting }) => {
      const visibility =
        isPOISectionVisible && poiSettings[setting] ? "visible" : "none";
      if (map.current.getLayer(id)) {
        map.current.setLayoutProperty(id, "visibility", visibility);
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
      poiSettings.district || poiSettings.mandal || poiSettings.village;

    if (shouldZoomToState) {
      let features = [];
      if (poiSettings.district) features = features.concat(districts.features);
      if (poiSettings.mandal) features = features.concat(mandals.features);
      if (poiSettings.village) features = features.concat(villages.features);
      if (features.length) {
        const stateBBox = bbox({ type: "FeatureCollection", features });
        map.current.fitBounds(stateBBox, { padding: 40 });
      }
    } else {
      map.current.flyTo({ center: DEFAULT_CENTER, zoom: DEFAULT_ZOOM });
    }
  }, [poiSettings, isPOISectionVisible, lulcToggles, isLULCSectionVisible]);

  useEffect(() => {
    if (!map.current) return;

    const findFeature = (collection, name, key) =>
      collection?.features?.find(
        (f) => f.properties?.[key]?.toLowerCase() === name?.toLowerCase()
      );

    const districtFeature = findFeature(districts, highlightDistrict, "NAME");
    const mandalFeature = findFeature(mandals, highlightMandal, "sdtname");

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

    if (districtFeature) {
      map.current.fitBounds(turf.bbox(districtFeature), { padding: 40 });
    } else if (mandalFeature) {
      map.current.fitBounds(turf.bbox(mandalFeature), { padding: 40 });
    } else {
      map.current.flyTo({ center: DEFAULT_CENTER, zoom: DEFAULT_ZOOM });
    }
  }, [highlightDistrict, highlightMandal]);

  useEffect(() => {
    if (!map.current || !draw.current) return;

    switch (activeTool) {
      case "print":
        window.print();
        break;
      case "pan":
        map.current.boxZoom.enable();
        draw.current.changeMode("simple_select");
        break;
      case "line":
        draw.current.changeMode("draw_line_string");
        break;
      case "polygon":
        draw.current.changeMode("draw_polygon");
        break;
      case "search":
        console.log("Search tool activated");
        break;
      default:
        draw.current.changeMode("simple_select");
        break;
    }
  }, [activeTool]);

  return <div ref={mapContainer} className="map-container" />;
}
