// routes/trip.js
const express = require("express");
const router = express.Router();
const { createTrip, getTrip, updateTrip } = require("../controllers/tripController");
const auth = require("../middleware/auth");

// @desc    Create Trip
// @route   POST /api/trips
// @access  Private
router.post("/", auth, createTrip);

// @desc    Get Trip by ID
// @route   GET /api/trips/:id
// @access  Private
router.get("/:id", auth, getTrip);

// @desc    Update Trip
// @route   PUT /api/trips/:id
// @access  Private
router.put("/:id", auth, updateTrip);


module.exports = router;
