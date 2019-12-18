const express = require("express");
const router = express.Router();
const Chunk = require("../models/chunk");
const Map = require("../models/map");

router.get("/", async (req, res) => {
  const maps = await Map.find({}, "name").sort("level");
  res.json(maps);
});

router.get("/:name", async (req, res) => {
  const map = await Map.findOne({ name: req.params.name });
  res.json(map);
});

router.post("/:name", async (req, res) => {
  await Map.findOneAndUpdate(
    { name: req.params.name },
    {
      $set: { chunks: req.body.chunks || [], entities: req.body.entities || [] }
    },
    {
      upsert: true
    }
  );
  res.json({ success: "probably" });
});

module.exports = router;
