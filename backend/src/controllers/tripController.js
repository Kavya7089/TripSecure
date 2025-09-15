// controllers/tripController.js
const Trip = require("../models/Trip");

// Create a trip
async function createTrip(req, res, next) {
  try {
    const trip = await Trip.create(req.body);
    res.status(201).json(trip);
  } catch (err) {
    next(err);
  }
}

// Get trip by ID
async function getTrip(req, res, next) {
  try {
    const trip = await Trip.findById(req.params.id);
    if (!trip) return res.status(404).json({ message: "Trip not found" });
    res.json(trip);
  } catch (err) {
    next(err);
  }
}

// Update trip
async function updateTrip(req, res, next) {
  try {
    const trip = await Trip.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!trip) return res.status(404).json({ message: "Trip not found" });
    res.json(trip);
  } catch (err) {
    next(err);
  }
}

module.exports = { createTrip, getTrip, updateTrip };
