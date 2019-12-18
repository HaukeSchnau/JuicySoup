const mongoose = require("mongoose");

const MapSchema = mongoose.Schema({
  level: Number,
  name: String,
  sprites: [String],
  spawnPoint: { x: Number, y: Number },
  backgroundImage: String,
  availableEntities: [String],
  entities: [
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
