const mongoose = require("mongoose");

// Define the schema
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  // Add any additional fields you might need for your user model
});

// Create the model from the schema and export it
module.exports = mongoose.model("User", UserSchema);
