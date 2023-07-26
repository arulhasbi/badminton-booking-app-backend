const express = require("express");
const router = express.Router();
const Court = require("../models/Court");

// Route for getting a list of all the courts
router.get("/", async (req, res) => {
  const page = parseInt(req.query.page) || 1; // default to page 1 if not provided
  const limit = parseInt(req.query.limit) || 6; // default to 10 items per page if not provided
  const skip = (page - 1) * limit;

  try {
    const total = await Court.countDocuments();
    const courts = await Court.find().skip(skip).limit(limit);
    res.status(200).json({
      total,
      page,
      pages: Math.ceil(total / limit),
      data: courts,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
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
