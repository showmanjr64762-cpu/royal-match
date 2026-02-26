const mongoose = require("mongoose");

const playerSchema = new mongoose.Schema({
  name: String,
  coins: Number,
  banned: { type: Boolean, default: false }
});

module.exports = mongoose.model("Player", playerSchema);