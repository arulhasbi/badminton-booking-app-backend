const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const passport = require("passport");

// Route for getting a list of all the users
router.get("/", async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Route for Google authentication
router.get("/google", passport.authenticate("google", { scope: ["profile"] }));
router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => {
    res.send("You have successfully logged in with Google!");
    // res.redirect("/dashboard");
  }
);

// Checks if the user is logged in
router.get("/check-auth", (req, res) => {
  res.json({ isLoggedIn: req.isAuthenticated() });
});

// Logs out the user
router.post("/logout", (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.send("You have successfully logged out!");
  });
});

module.exports = router;
