const mongoose = require("mongoose");

const ArenaSchema = new mongoose.Schema({
  arenaCode: {
    type: String,
    require: true,
    unique: true,
  },
  court: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Court",
    required: true,
  },
});

module.exports = mongoose.model("Arena", ArenaSchema);
