const express = require("express");
const router = express.Router();
const Chunk = require("../models/chunk");
const Map = require("../models/map");

router.get("/", async (req, res) => {
  const maps = await Map.find({}, "name");
  res.json(maps);
});

router.get("/:name", async (req, res) => {
  const map = await Map.findOne({ name: req.params.name });
  res.json(map);
});

router.post("/", async (req, res) => {
  for (let i = 0; i < req.body.length; i++) {
    const chunk = req.body[i];
    await Chunk.findOneAndUpdate({ x: chunk.x, y: chunk.y }, chunk, {
      upsert: true
    });
  }
  res.json({ success: "probably" });
});

module.exports = router;
