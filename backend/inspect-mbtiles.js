// inspect-mbtiles.js
import MBTiles from "@mapbox/mbtiles";
import path from "path";

const mbtilesPath = path.join(
  process.cwd(),
  "mbtiles",
  "tadepalli_topomap.mbtiles"
);

new MBTiles(mbtilesPath + "?mode=ro", (err, mbtiles) => {
  if (err) return console.error("Failed to open MBTiles:", err);

  console.log("✅ MBTiles loaded");

  // Check metadata to find the tile format
  mbtiles.getInfo((err, info) => {
    if (err) return console.error("Metadata error:", err);
    console.log("📄 Metadata:", info);

    // Now test tile existence for z=14, x=11861, y=7432
    mbtiles.getTile(14, 11861, 7432, (err, tile, headers) => {
      if (err) {
        console.error("❌ Tile not found at 14/11861/7432:", err.message);
      } else {
        console.log("✅ Tile found! Headers:", headers);
        const format = headers["Content-Type"];
        console.log("🖼️ Detected tile format:", format);
      }
    });
  });
});
