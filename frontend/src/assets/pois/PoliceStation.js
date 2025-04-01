const policeStation = {
  type: "FeatureCollection",
  name: "Police Station",
  crs: { type: "name", properties: { name: "urn:ogc:def:crs:OGC:1.3:CRS84" } },
  features: [
    {
      type: "Feature",
      properties: {
        State: "Andhra Pradesh",
        District: "Guntur",
        PSName: "Tadepalli",
        Latitude: 16.481547,
        Longitude: 80.603527,
      },
      geometry: { type: "Point", coordinates: [80.603527, 16.481547] },
    },
  ],
};

export default policeStation;
