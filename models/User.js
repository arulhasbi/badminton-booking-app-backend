const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  googleId: {
    type: String,
    required: false,
  },
  displayName: {
    type: String,
    required: false,
  },
  image: {
    type: String,
    required: false,
  },
  fullName: {
    type: String,
    required: false,
  },
  whatsapp: {
    type: String,
    required: false,
  },
  password: {
    type: String,
    required: false,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  emailToken: {
    type: String,
  },
});

module.exports = mongoose.model("User", UserSchema);
