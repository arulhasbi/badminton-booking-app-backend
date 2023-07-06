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

// Route for registering a new user
// router.post("/register", async (req, res) => {
//   try {
//     // Hash password before saving user
//     const hashedPassword = bcrypt.hashSync(req.body.password, 10); // Salt & hash

//     const newUser = new User({
//       name: req.body.name,
//       email: req.body.email,
//       password: hashedPassword, // Store hashed password
//     });

//     await newUser.save();

//     res.status(201).json({ message: "User registered successfully!" });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

// Route for authenticating a user
router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (user && bcrypt.compareSync(req.body.password, user.password)) {
      res.status(200).json({ message: "User authenticated successfully!" });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
