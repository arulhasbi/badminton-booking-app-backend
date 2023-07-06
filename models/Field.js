const mongoose = require("mongoose");

// Define the schema
const FieldSchema = new mongoose.Schema({
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
  // Add any additional fields you might need for your user model
});

// Create the model from the schema and export it
module.exports = mongoose.model("Field", FieldSchema);
