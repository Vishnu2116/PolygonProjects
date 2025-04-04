// test-tile-check.js
import MBTiles from "@mapbox/mbtiles";
import path from "path";

const mbtilesPath = path.join(
  process.cwd(),
  "mbtiles",
  "tadepalli_topomap.mbtiles"
);

new MBTiles(mbtilesPath + "?mode=ro", (err, mbtiles) => {
  if (err) return console.error("Failed to open:", err);

  mbtiles.getTile(14, 11861, 7432, (err, tile, headers) => {
    if (err) {
      console.log("Tile not found:", err.message); // ← will say "Tile does not exist"
    } else {
      console.log("Tile found!", headers);
    }
  });
});
