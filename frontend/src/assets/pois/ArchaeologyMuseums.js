const archMuse = {
  type: "FeatureCollection",
  name: "Archaeology & Museums",
  crs: { type: "name", properties: { name: "urn:ogc:def:crs:OGC:1.3:CRS84" } },
  features: [
    {
      type: "Feature",
      properties: {
        S_No: "84",
        Name: "Rock Cut Cave",
        State: "Andhra Pradesh",
        District: "Guntur",
        Mandal: "Tadepalli",
        Locality: "Sitanagaram(Tadepalli)",
        Status: "State",
      },
      geometry: {
        type: "Point",
        coordinates: [80.60556644463577, 16.500728656302499, 0.0],
      },
    },
  ],
};

export default archMuse;
