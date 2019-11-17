const mongoose = require("mongoose");

const ChunkSchema = mongoose.Schema({
  x: Number,
  y: Number,
  data: [Number]
});

const Chunk = (module.exports = mongoose.model("Chunk", ChunkSchema));
