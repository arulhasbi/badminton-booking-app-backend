const mongoose = require("mongoose");

// Define the schema
const BookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  reservation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Reservation",
  },
  payment_status: {
    type: String,
    enum: ["pending", "completed", "failed", "refunded"],
    default: "pending",
  },
  payment_method: {
    type: String,
    enum: ["credit_card", "paypal", "bank_transfer"],
    required: true,
  },
  payment_details: {
    type: mongoose.Schema.Types.Mixed,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
});

// Create the model from the schema and export it
module.exports = mongoose.model("Booking", BookingSchema);
