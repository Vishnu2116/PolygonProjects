import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "../styles/MapView.css";
import geojson from "../assets/tadgeojson";

// POIs
import anganwadi from "../assets/AngawadiCenters.js";
import canal from "../assets/Canal.js";
import forest from "../assets/Forest.js";

mapboxgl.accessToken =
  "pk.eyJ1IjoicmF5YXBhdGk0OSIsImEiOiJjbGVvMWp6OGIwajFpM3luNTBqZHhweXZzIn0.1r2DoIQ1Gf2K3e5WBgDNjA";

export default function MapView({
  onSelectPolygon,
  poiSettings,
  isPOISectionVisible,
}) {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [districts, setDistricts] = useState(null);
  const [mandals, setMandals] = useState(null);

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

  // ✅ Load districts and mandals from public folder
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

  // ✅ Initialize map
  useEffect(() => {
    if (!districts || !mandals || map.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [80.617958, 16.481112],
      zoom: 7,
    });

    map.current.addControl(new mapboxgl.NavigationControl());

    map.current.on("load", () => {
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
        id: "parcel-labels",
        type: "symbol",
        source: "parcels",
        layout: {
          "text-field": ["get", "Parcel_num"],
          "text-size": 12,
          "text-font": ["Open Sans Bold", "Arial Unicode MS Bold"],
        },
        paint: {
          "text-color": "#111",
          "text-halo-color": "#fff",
          "text-halo-width": 1.5,
        },
      });

      map.current.on("click", "parcels-fill", (e) => {
        const feature = e.features[0];
        onSelectPolygon(feature.properties);
      });

      const bounds = new mapboxgl.LngLatBounds();
      districts.features.forEach((feature) => {
        const coords = feature.geometry.coordinates;
        const flatCoords =
          feature.geometry.type === "Polygon" ? coords[0] : coords[0][0];
        flatCoords.forEach(([lng, lat]) => bounds.extend([lng, lat]));
      });
      map.current.fitBounds(bounds, { padding: 20 });

      // ✅ Districts
      map.current.addSource("districts", { type: "geojson", data: districts });
      map.current.addLayer({
        id: "districts-fill",
        type: "fill",
        source: "districts",
        paint: { "fill-color": "#ADD8E6", "fill-opacity": 0.4 },
        layout: { visibility: "none" },
      });
      map.current.addLayer({
        id: "districts-outline",
        type: "line",
        source: "districts",
        paint: { "line-color": "#0a0a0a", "line-width": 2.5 },
        layout: { visibility: "none" },
      });
      map.current.addLayer({
        id: "districts-label",
        type: "symbol",
        source: "districts",
        layout: {
          "text-field": ["get", "NAME"],
          "text-size": 14,
          "text-font": ["Open Sans Bold"],
          "text-anchor": "center",
          visibility: "none", // Always visible
        },
        paint: {
          "text-color": "#004466",
          "text-halo-color": "#fff",
          "text-halo-width": 2,
        },
      });

      // ✅ Mandals
      map.current.addSource("mandals", { type: "geojson", data: mandals });
      map.current.addLayer({
        id: "mandals-fill",
        type: "fill",
        source: "mandals",
        paint: { "fill-color": "#FFD700", "fill-opacity": 0.3 },
        layout: { visibility: "none" },
      });
      map.current.addLayer({
        id: "mandals-outline",
        type: "line",
        source: "mandals",
        paint: { "line-color": "#DAA520", "line-width": 2 },
        layout: { visibility: "none" },
      });
      map.current.addLayer({
        id: "mandals-label",
        type: "symbol",
        source: "mandals",
        layout: {
          "text-field": ["get", "sdtname"],
          "text-size": 12,
          "text-font": ["Open Sans Bold"],
          "text-anchor": "center",
          visibility: "none",
        },
        paint: {
          "text-color": "#1e3a8a",
          "text-halo-color": "#fff",
          "text-halo-width": 1.2,
        },
      });

      // ✅ POIs
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
        } else if (type.includes("Line")) {
          map.current.addLayer({
            id,
            type: "line",
            source: id,
            paint: { "line-color": color, "line-width": 3 },
            layout: { visibility: "none" },
          });
        } else if (type.includes("Polygon")) {
          map.current.addLayer({
            id,
            type: "fill",
            source: id,
            paint: { "fill-color": color, "fill-opacity": 0.4 },
            layout: { visibility: "none" },
          });
          map.current.addLayer({
            id: `${id}-outline`,
            type: "line",
            source: id,
            paint: { "line-color": "#000", "line-width": 1 },
            layout: { visibility: "none" },
          });
        }
      });
    });
  }, [districts, mandals]);

  // ✅ Toggle visibility
  useEffect(() => {
    if (!map.current || !poiSettings) return;

    POI_LAYERS.forEach(({ id, setting }) => {
      const visible =
        isPOISectionVisible && poiSettings[setting] ? "visible" : "none";
      if (map.current.getLayer(id))
        map.current.setLayoutProperty(id, "visibility", visible);
      if (map.current.getLayer(`${id}-outline`))
        map.current.setLayoutProperty(`${id}-outline`, "visibility", visible);
    });

    // District toggles
    ["districts-fill", "districts-outline"].forEach((id) => {
      const visible = poiSettings["district"] ? "visible" : "none";
      if (map.current.getLayer(id))
        map.current.setLayoutProperty(id, "visibility", visible);
    });

    // Mandal toggles
    ["mandals-fill", "mandals-outline", "mandals-label"].forEach((id) => {
      const visible = poiSettings["mandal"] ? "visible" : "none";
      if (map.current.getLayer(id))
        map.current.setLayoutProperty(id, "visibility", visible);
    });

    // Always show district labels
    if (map.current.getLayer("districts-label")) {
      map.current.setLayoutProperty("districts-label", "visibility", "visible");
    }
  }, [poiSettings, isPOISectionVisible]);

  return <div ref={mapContainer} className="map-container" />;
}
