const mongoose = require("mongoose");

const TimeSlotSchema = new mongoose.Schema({
  hourRange: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("TimeSlot", TimeSlotSchema);
