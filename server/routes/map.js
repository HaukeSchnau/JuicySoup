const express = require("express");
const router = express.Router();
const Chunk = require("../models/chunk");

router.get("/", async (req, res) => {
  const chunks = await Chunk.find({});
  res.json(chunks);
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
