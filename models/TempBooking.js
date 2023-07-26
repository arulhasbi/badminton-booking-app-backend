const mongoose = require("mongoose");

const TempBookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  court: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Court",
    required: true,
  },
  arena: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Arena",
    required: true,
  },
  time_slots: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TimeSlot",
      required: true,
    },
  ],
  bookingDate: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: ["draft", "pending", "confirmed", "cancelled"],
    default: "draft",
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date,
  },
});

module.exports = mongoose.model("TempBookingSchema", TempBookingSchema);
