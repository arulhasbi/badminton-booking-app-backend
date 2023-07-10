const express = require("express");
const router = express.Router();
const Court = require("../models/Court");

// Route for getting a list of all the courts
router.get("/", async (req, res) => {
  try {
    const courts = await Court.find({});
    res.status(200).json(courts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Route for creating a new court
router.post("/", async (req, res) => {
  try {
    const newCourt = new Court(req.body);
    await newCourt.save();

    res.status(201).json({ message: "Court created successfully!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Route for getting a court by its ID
router.get("/:id", async (req, res) => {
  try {
    const court = await Court.findById(req.params.id);
    if (court == null) {
      return res.status(404).json({ message: "Cannot find court" });
    }
    res.court = court;
    res.status(200).json(res.court);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

module.exports = router;
