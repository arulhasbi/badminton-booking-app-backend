const express = require("express");
const router = express.Router();
const TimeSlot = require("../models/TimeSlot");

// Route for getting a list of all the time slots
router.get("/", async (req, res) => {
  try {
    const timeSlots = await TimeSlot.find({});
    res.status(200).json(timeSlots);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Route for creating a new time slot
router.post("/", async (req, res) => {
  try {
    const newTimeSlot = new TimeSlot(req.body);
    await newTimeSlot.save();

    res.status(201).json({ message: "Time slot created successfully!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
