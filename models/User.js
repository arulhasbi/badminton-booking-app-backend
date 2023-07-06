const mongoose = require("mongoose");

// Define the schema
const UserSchema = new mongoose.Schema({
  googleId: {
    type: String,
    required: true,
  },
  displayName: {
    type: String,
    required: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  image: {
    type: String,
  },
  // Add any additional fields you might need for your user model
});

// Create the model from the schema and export it
module.exports = mongoose.model("User", UserSchema);
