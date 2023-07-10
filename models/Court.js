const mongoose = require("mongoose");

//  Schema
const CourtSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  rate: {
    type: Number,
    required: true,
  },
  imageUrl: {
    type: [String], // Changed from String to [String]
    required: true,
  },
});

// Create the model from the schema and export it
module.exports = mongoose.model("Court", CourtSchema);
