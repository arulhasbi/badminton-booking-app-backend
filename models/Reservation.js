const mongoose = require("mongoose");

const ReservationSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
  },
  arena: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Arena",
    required: true,
  },
  timeSlot: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "TimeSlot",
    required: true,
  },
  reservedStatus: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model("Reservation", ReservationSchema);
