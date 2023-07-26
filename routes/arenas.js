const express = require("express");
const router = express.Router();
const Arena = require("../models/Arena");

// Get all arenas for a specific court
router.get("/:courtId", async (req, res) => {
  try {
    const arenas = await Arena.find({ court: req.params.courtId });
    res.status(200).json(arenas);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a new arena for a specific court
router.post("/:courtId", async (req, res) => {
  const arena = new Arena({
    arenaCode: req.body.arenaCode,
    court: req.params.courtId,
  });

  try {
    const newArena = await arena.save();
    res.status(201).json(newArena);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
