const express = require("express");
const router = express.Router();
const Field = require("../models/Field");

// Route for getting a list of all the fields
router.get("/", async (req, res) => {
  try {
    const fields = await Field.find({});
    res.status(200).json(fields);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Route for creating a new field
router.post("/", async (req, res) => {
  try {
    const newField = new Field(req.body);
    await newField.save();

    res.status(201).json({ message: "Field created successfully!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
