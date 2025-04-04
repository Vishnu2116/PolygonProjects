import express from "express";
import path from "path";
import MBTiles from "@mapbox/mbtiles";

const router = express.Router();

// Define all your MBTiles filenames and keys here
const mbtilesFiles = {
  topography: "tadepalli_topomap.mbtiles",
  fmb137: "fmb_137.mbtiles",
};

// Create full paths relative to your backend directory
const mbtilesDir = path.resolve(process.cwd(), "data");

const tileHandlers = {};

// Load each MBTiles file
Object.entries(mbtilesFiles).forEach(([key, filename]) => {
  const fullPath = path.join(mbtilesDir, filename);
  new MBTiles(fullPath + "?mode=ro", (err, mbtiles) => {
    if (err) {
      console.error(
        `❌ Failed to load ${key} MBTiles from ${fullPath}:`,
        err.message
      );
    } else {
      console.log(`✅ ${key} MBTiles loaded successfully from ${fullPath}`);
      tileHandlers[key] = mbtiles;
    }
  });
});

// Serve tiles from route: /tiles/:layer/:z/:x/:y.png
router.get("/:layer/:z/:x/:y.png", (req, res) => {
  const { layer, z, x, y } = req.params;
  const mbtiles = tileHandlers[layer];

  if (!mbtiles) {
    return res.status(404).send(`Layer "${layer}" not found`);
  }

  mbtiles.getTile(+z, +x, +y, (err, tile, headers) => {
    if (err || !tile) {
      return res.status(404).send("Tile not found");
    }

    res.set(headers).send(tile);
  });
});

export default router;
