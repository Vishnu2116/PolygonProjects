import React, { useEffect, useRef } from "react";
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
    if (map.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [80.617958, 16.481112],
      zoom: 11,
    });

    map.current.addControl(new mapboxgl.NavigationControl());

    map.current.on("load", () => {
      map.current.addSource("parcels", {
        type: "geojson",
        data: geojson,
      });

      map.current.addLayer({
        id: "parcels-fill",
        type: "fill",
        source: "parcels",
        paint: {
          "fill-color": "#0080ff",
          "fill-opacity": 0.3,
        },
      });

      map.current.addLayer({
        id: "parcels-outline",
        type: "line",
        source: "parcels",
        paint: {
          "line-color": "#003366",
          "line-width": 1.2,
        },
      });
      map.current.addLayer({
        id: "parcel-labels",
        type: "symbol",
        source: "parcels",
        layout: {
          "text-field": ["get", "Parcel_num"], // 👈 change this to your actual field name
          "text-size": 12,
          "text-font": ["Open Sans Bold", "Arial Unicode MS Bold"],
          "text-allow-overlap": false,
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
        console.log(feature.properties);
      });

      map.current.on("mouseenter", "parcels-fill", () => {
        map.current.getCanvas().style.cursor = "pointer";
      });

      map.current.on("mouseleave", "parcels-fill", () => {
        map.current.getCanvas().style.cursor = "";
      });

      const bounds = new mapboxgl.LngLatBounds();
      geojson.features.forEach((feature) => {
        const coords = feature.geometry.coordinates;
        const flatCoords =
          feature.geometry.type === "Polygon" ? coords[0] : coords[0][0];
        flatCoords.forEach(([lng, lat]) => bounds.extend([lng, lat]));
      });
      map.current.fitBounds(bounds, { padding: 20 });

      // Add POI layers
      POI_LAYERS.forEach(({ id, data, color }) => {
        map.current.addSource(id, {
          type: "geojson",
          data,
        });

        const geometryType = data.features[0]?.geometry?.type;

        if (geometryType === "Point") {
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
        } else if (geometryType.includes("Line")) {
          map.current.addLayer({
            id,
            type: "line",
            source: id,
            paint: {
              "line-color": color,
              "line-width": 3,
            },
            layout: { visibility: "none" },
          });
        } else if (geometryType.includes("Polygon")) {
          map.current.addLayer({
            id,
            type: "fill",
            source: id,
            paint: {
              "fill-color": color,
              "fill-opacity": 0.4,
            },
            layout: { visibility: "none" },
          });

          map.current.addLayer({
            id: `${id}-outline`,
            type: "line",
            source: id,
            paint: {
              "line-color": "#000000",
              "line-width": 1,
            },
            layout: { visibility: "none" },
          });
        }
      });
    });
  }, []);

  // Toggle visibility when settings or POI section toggle changes
  useEffect(() => {
    if (!map.current || !poiSettings) return;

    POI_LAYERS.forEach(({ id, setting }) => {
      const visible =
        isPOISectionVisible && poiSettings[setting] ? "visible" : "none";

      if (map.current.getLayer(id)) {
        map.current.setLayoutProperty(id, "visibility", visible);
      }

      if (map.current.getLayer(`${id}-outline`)) {
        map.current.setLayoutProperty(`${id}-outline`, "visibility", visible);
      }
    });
  }, [poiSettings, isPOISectionVisible]);

  return <div ref={mapContainer} className="map-container" />;
}
