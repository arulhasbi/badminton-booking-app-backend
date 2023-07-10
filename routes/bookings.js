const express = require("express");
const router = express.Router();
const Booking = require("../models/Booking");

// Route for getting a list of all the bookings
router.get("/", async (req, res) => {
  try {
    const bookings = await Booking.find({});
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Route for booking a court
router.post("/", async (req, res) => {
  try {
    const newBooking = new Booking(req.body);
    await newBooking.save();

    res.status(201).json({ message: "Booking created successfully!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
