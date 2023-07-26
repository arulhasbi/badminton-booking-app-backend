const express = require("express");
const router = express.Router();
const TempBooking = require("../models/TempBooking");

router.get("/", async (req, res) => {
  if (!req.session.userId) {
    return res.status(401).send("Not logged in");
  }

  try {
    const tempBooking = await TempBooking.findOne({
      userId: req.session.userId,
    });
    if (!tempBooking) {
      return res.status(404).send("No temporary booking found for this user");
    }
    return res.json(tempBooking);
  } catch (error) {
    console.error(error);
    return res.status(500).send("Server error");
  }
});

router.put("/", async (req, res) => {
  if (!req.session.userId) {
    return res.status(401).send("Not logged in");
  }
  try {
    const { court, arena, time_slots, bookingDate } = req.body;
    const updatedTempBooking = await TempBooking.findOneAndUpdate(
      {
        userId: req.session.userId,
      },
      {
        court,
        arena,
        time_slots,
        bookingDate,
        status: "draft",
        updated_at: Date.now(),
      },
      { new: true }
    );
    if (!updatedTempBooking) {
      return res.status(404).send("No temporary booking found for this user");
    }
    return res.json(updatedTempBooking);
  } catch (error) {
    console.error(error);
    return res.status(500).send("Server error");
  }
});

router.post("/checkout", async (req, res) => {
  if (!req.session.userId) {
    return res.status(401).send("Not logged in");
  }
  try {
    const tempBooking = await TempBooking.findOne({ user: req.session.userId });
    if (!tempBooking) {
      return res.status(404).send("No temporary booking found for this user");
    }
    if (tempBooking.status !== "draft") {
      return res.status(400).send("This booking has already been finalized");
    }
    tempBooking.status = "confirmed"; // Or 'pending', depending on your business logic
    tempBooking.updated_at = Date.now();
    await tempBooking.save();
    return res.json(tempBooking);
  } catch (error) {
    console.error(error);
    return res.status(500).send("Server error");
  }
});

module.exports = router;
