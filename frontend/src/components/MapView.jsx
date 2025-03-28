import React, { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import * as turf from "@turf/turf";

import "../styles/MapView.css";
import geojson from "../assets/tadgeojson";
import anganwadi from "../assets/AngawadiCenters.js";
import canal from "../assets/Canal.js";
import forest from "../assets/Forest.js";
import LULC from "../assets/LULC.js";

mapboxgl.accessToken =
  "pk.eyJ1IjoicmF5YXBhdGk0OSIsImEiOiJjbGVvMWp6OGIwajFpM3luNTBqZHhweXZzIn0.1r2DoIQ1Gf2K3e5WBgDNjA";

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
      // === Parcel Layers
      map.current.addSource("parcels", { type: "geojson", data: geojson });
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

      map.current.on("click", "parcels-fill", (e) => {
        const feature = e.features[0];
        const area = turf.area(feature) * 0.000247105;
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

      const addBoundary = (id, data, nameField, fillColor, lineColor) => {
        map.current.addSource(id, { type: "geojson", data });
        map.current.addLayer({
          id: `${id}-fill`,
          type: "fill",
          source: id,
          paint: { "fill-color": fillColor, "fill-opacity": 0.4 },
          layout: { visibility: "none" },
        });
        map.current.addLayer({
          id: `${id}-outline`,
          type: "line",
          source: id,
          paint: { "line-color": lineColor, "line-width": 2 },
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
      };

      addBoundary("villages", villages, "NAME", "#ADD8E6", "#0a0a0a");
      addBoundary("districts", districts, "NAME", "#ADD8E6", "#0a0a0a");
      addBoundary("mandals", mandals, "sdtname", "#FFD700", "#DAA520");

      // === Highlight Layers
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

      // === POI Layers
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
        } else if (type === "MultiLineString") {
          map.current.addLayer({
            id,
            type: "line",
            source: id,
            paint: { "line-color": color, "line-width": 3 },
            layout: { visibility: "none" },
          });
        }
      });

      // === LULC
      map.current.addSource("lulc", { type: "geojson", data: LULC });
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

      // === Draw Tool
      draw.current = new MapboxDraw({
        displayControlsDefault: false,
        controls: {},
        defaultMode: "simple_select",
      });
      map.current.addControl(draw.current);

      // Automatically enter select mode after drawing
      map.current.on("draw.create", () => {
        draw.current.changeMode("simple_select");
      });
    });
  }, [districts, mandals, villages]);

  // === Handle Layer Toggles
  useEffect(() => {
    if (!map.current) return;

    const toggleLayers = (ids, key) => {
      const visible = poiSettings[key] ? "visible" : "none";
      ids.forEach((id) => {
        if (map.current.getLayer(id)) {
          map.current.setLayoutProperty(id, "visibility", visible);
        }
      });
    };

    toggleLayers(
      ["districts-fill", "districts-outline", "districts-label"],
      "district"
    );
    toggleLayers(
      ["mandals-fill", "mandals-outline", "mandals-label"],
      "mandal"
    );
    toggleLayers(
      ["villages-fill", "villages-outline", "villages-label"],
      "village"
    );

    POI_LAYERS.forEach(({ id, setting }) => {
      const visible =
        isPOISectionVisible && poiSettings[setting] ? "visible" : "none";
      if (map.current.getLayer(id)) {
        map.current.setLayoutProperty(id, "visibility", visible);
      }
    });

    Object.keys(lulcToggles).forEach((category) => {
      const layerId = `lulc-${category.replace(/\s+/g, "-").toLowerCase()}`;
      const visibility =
        isLULCSectionVisible && lulcToggles[category] ? "visible" : "none";
      if (map.current.getLayer(layerId)) {
        map.current.setLayoutProperty(layerId, "visibility", visibility);
      }
    });
  }, [poiSettings, isPOISectionVisible, lulcToggles, isLULCSectionVisible]);

  // === Highlight and Zoom
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
      map.current.flyTo({
        center: DEFAULT_CENTER,
        zoom: DEFAULT_ZOOM,
        essential: true,
      });
    }
  }, [highlightDistrict, highlightMandal]);

  // === Toolbar Interactions
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
