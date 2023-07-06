const mongoose = require("mongoose");

// Define the schema
const BookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  field: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Field",
    required: true,
  },
  booking_date: {
    type: Date,
    required: true,
  },
  time_slot: {
    type: String,
    required: true,
  },
  // Add any additional fields you might need for your user model
});

// Create the model from the schema and export it
module.exports = mongoose.model("Booking", BookingSchema);
