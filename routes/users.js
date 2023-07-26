const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const sendVerificationEmail = require("../utils/sendVerificationEmail");

// Route for getting a list of all the users
router.get("/", async (req, res, next) => {
  try {
    const users = await User.find({});
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
});

// Route for Google authentication
router.get("/google", passport.authenticate("google", { scope: ["profile"] }));
router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => {
    req.session.userId = req.user.id;
    res.redirect("http://localhost:3000/auth");
  }
);

// Logs out the user
router.post("/logout", (req, res, next) => {
  res.cookie("token", "", { expires: new Date(0) });
  res.json({ message: "Berhasil log out." });
});

router.post("/register", async (req, res, next) => {
  try {
    const { fullName, email, whatsapp, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: "Email telah didaftarkan. Mohon gunakan email berbeda.",
      });
    }
    const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS) || 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const newUser = new User({
      fullName,
      email,
      whatsapp,
      password: hashedPassword,
    });
    await newUser.save();
    const emailToken = jwt.sign(
      {
        userId: newUser._id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "24h",
      }
    );
    newUser.emailToken = emailToken;
    sendVerificationEmail(newUser.email, emailToken);
    res.status(201).json({ message: "Akun berhasil didaftarkan." });
  } catch (error) {
    next(error);
  }
});

router.get("/verify-email", async (req, res, next) => {
  try {
    const { token } = req.query;
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(payload.userId);
    if (!user) {
      res.status(400).render("verification-failed", {
        message: "Invalid or expired token.",
      });
    } else {
      user.isVerified = true;
      user.emailToken = undefined;
      await user.save();
      res.render("verified-email");
    }
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      res.render("verification-failed");
      return;
    }
    next(error);
  }
});

// resend verification in case toke expires
router.post("/resend-verification", async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Email belum terdaftar." });
    }
    if (user.isVerified) {
      return res.status(400).json({ message: "Email sudah terverifikasi." });
    }
    // Create a new email verification token
    const emailToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    // Send verification email
    sendVerificationEmail(user.email, emailToken);
    res.status(201).json({
      message: "Tautan verifikasi telah dikirimkan. Silakan cek email.",
    });
  } catch (error) {
    next(error);
  }
});

// user login
router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(400).json({ message: "User tidak ditemukan." });
    }
    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Password tidak benar." });
    }
    if (!user.isVerified) {
      return res.status(400).json({ message: "Email belum terverifikasi." });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    if (process.env.NODE_ENV === "development") {
      res.cookie("token", token, {
        httpOnly: true,
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
    } else {
      res.cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
    }
    return res
      .status(201)
      .json({ user: { name: user.fullName, email: user.email } });
  } catch (error) {
    return next(error);
  }
});

// JWT token validity checking
router.get("/auth", (req, res) => {
  const token = req.cookies.token;
  if (!token) {
    // 401 Unauthorized: the client must authenticate itself to get the requested response
    return res.status(401).json({ valid: false });
  }
  jwt.verify(token, process.env.JWT_SECRET, async (err, user) => {
    if (err) {
      // 403 Forbidden: the client does not have access rights to the content
      return res.status(403).json({ valid: false });
    }
    // Check if the user ID in the JWT corresponds to a valid user
    const validUser = await User.findById(user.id);
    if (!validUser) {
      // 404 Not Found: the server can not find the requested resource
      return res.status(404).json({ valid: false });
    }
    // 200 OK: the request was successful
    return res.status(200).json({ valid: true });
  });
});

module.exports = router;
