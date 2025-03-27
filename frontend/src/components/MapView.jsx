import React, { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import "../styles/MapView.css";
import geojson from "../assets/tadgeojson";
import anganwadi from "../assets/AngawadiCenters.js";
import canal from "../assets/Canal.js";
import forest from "../assets/Forest.js";
import * as turf from "@turf/turf";

mapboxgl.accessToken =
  "pk.eyJ1IjoicmF5YXBhdGk0OSIsImEiOiJjbGVvMWp6OGIwajFpM3luNTBqZHhweXZzIn0.1r2DoIQ1Gf2K3e5WBgDNjA";

export default function MapView({
  onSelectPolygon,
  poiSettings,
  isPOISectionVisible,
  districts,
  mandals,
  villages,
  highlightDistrict,
  highlightMandal,
  highlightVillage,
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
    if (!districts || !mandals || map.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [80.60631782501012, 16.475043343851635],
      zoom: 13,
    });

    map.current.addControl(new mapboxgl.NavigationControl());

    map.current.on("load", () => {
      // === Add Parcels
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

      map.current.on("click", "parcels-fill", (e) => {
        const feature = e.features[0];
        onSelectPolygon(feature.properties);
      });
      map.current.on("click", "parcels-fill", (e) => {
        const feature = e.features[0];
        const coordinates = e.lngLat;
        const areaSqMeters = turf.area(feature); // feature must be a GeoJSON Feature
        const areaAcres = areaSqMeters * 0.000247105;

        //fire external callback
        onSelectPolygon(feature.properties);

        // Create and show popup
        new mapboxgl.Popup()
          .setLngLat(coordinates)
          .setHTML(
            `
            <strong>Parcel Number: </strong> ${
              feature.properties.Parcel_num
            }<br>
            <strong>Parcel Area:
            </strong> ${areaAcres.toFixed(2)} acres`
          )
          .addTo(map.current);
      });

      // === Parcel Number Labels
      map.current.addLayer({
        id: "parcels-label",
        type: "symbol",
        source: "parcels",
        layout: {
          "text-field": ["get", "Parcel_num"], // Change to the actual property name if different
          "text-size": 12,
          "text-font": ["Open Sans Bold"],
          "text-offset": [0, 0.6],
          "text-anchor": "top",
        },
        paint: {
          "text-color": "#111",
          "text-halo-color": "#fff",
          "text-halo-width": 1.2,
        },
      });

      // Add Villages

      map.current.addSource("villages", { type: "geojson", data: villages });

      map.current.addLayer({
        id: "villages-fill",
        type: "fill",
        source: "villages",
        paint: { "fill-color": "#ADD8E6", "fill-opacity": 0.4 },
        layout: { visibility: "none" },
      });

      map.current.addLayer({
        id: "villages-outline",
        type: "line",
        source: "villages",
        paint: { "line-color": "#0a0a0a", "line-width": 2.5 },
        layout: { visibility: "none" },
      });

      map.current.addLayer({
        id: "villages-label",
        type: "symbol",
        source: "villages",
        layout: {
          "text-field": ["get", "NAME"],
          "text-size": 14,
          "text-font": ["Open Sans Bold"],
          "text-anchor": "center",
          visibility: "none",
        },
        paint: {
          "text-color": "#004466",
          "text-halo-color": "#fff",
          "text-halo-width": 2,
        },
      });

      // === Add Districts
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
          visibility: "none",
        },
        paint: {
          "text-color": "#004466",
          "text-halo-color": "#fff",
          "text-halo-width": 2,
        },
      });

      // === Add Mandals
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

      // === Add POIs
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

      // === Highlight Layers
      map.current.addSource("highlight-district", {
        type: "geojson",
        data: { type: "FeatureCollection", features: [] },
      });

      map.current.addLayer({
        id: "highlight-district-line",
        type: "line",
        source: "highlight-district",
        paint: { "line-color": "#0000FF", "line-width": 5 },
      });

      map.current.addSource("highlight-mandal", {
        type: "geojson",
        data: { type: "FeatureCollection", features: [] },
      });

      map.current.addLayer({
        id: "highlight-mandal-line",
        type: "line",
        source: "highlight-mandal",
        paint: { "line-color": "#FF0000", "line-width": 4 },
      });
    });
  }, [districts, mandals]);

  // === Toggle visibility
  useEffect(() => {
    if (!map.current || !poiSettings) return;

    POI_LAYERS.forEach(({ id, setting }) => {
      const visibility =
        isPOISectionVisible && poiSettings[setting] ? "visible" : "none";
      if (map.current.getLayer(id))
        map.current.setLayoutProperty(id, "visibility", visibility);
      if (map.current.getLayer(`${id}-outline`))
        map.current.setLayoutProperty(
          `${id}-outline`,
          "visibility",
          visibility
        );
    });

    //toggling district layers
    ["districts-fill", "districts-outline", "districts-label"].forEach((id) => {
      const visible = poiSettings["district"] ? "visible" : "none";
      if (map.current.getLayer(id))
        map.current.setLayoutProperty(id, "visibility", visible);
    });

    //toggling mandal layers
    ["mandals-fill", "mandals-outline", "mandals-label"].forEach((id) => {
      const visible = poiSettings["mandal"] ? "visible" : "none";
      if (map.current.getLayer(id))
        map.current.setLayoutProperty(id, "visibility", visible);
    });

    //toggling village layers
    ["villages-fill", "villages-outline", "villages-label"].forEach((id) => {
      const visible = poiSettings["village"] ? "visible" : "none";
      if (map.current.getLayer(id))
        map.current.setLayoutProperty(id, "visibility", visible);
    });
  }, [poiSettings, isPOISectionVisible]);

  // === Highlight District & Mandal
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
  }, [highlightDistrict, highlightMandal]);

  return <div ref={mapContainer} className="map-container" />;
}
