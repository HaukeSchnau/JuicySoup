const mongoose = require("mongoose");

const MapSchema = mongoose.Schema({
  name: String,
  spawnPoint: { x: Number, y: Number },
  backgroundImage: String,
  monsters: [
    {
      type: { type: String },
      maxHealth: Number,
      x: Number,
      y: Number,
      width: Number,
      height: Number
    }
  ],
  chunks: [
    {
      x: Number,
      y: Number,
      data: [Number]
    }
  ]
});

const Map = (module.exports = mongoose.model("Map", MapSchema));
