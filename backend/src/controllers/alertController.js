// controllers/alertController.js
const Alert = require("../models/Alert"); // <-- optional if you have a model

// Panic Button (SOS) Alert
async function panicAlert(req, res, next) {
  try {
    // Example: save or broadcast SOS
    const alert = await Alert.create({
      user: req.user.id,
      type: "panic",
      location: req.body.location,
      timestamp: new Date()
    });
    res.status(201).json({ success: true, alert });
  } catch (err) {
    next(err);
  }
}

// GeoFence Alert
async function geoFenceAlert(req, res, next) {
  try {
    const alert = await Alert.create({
      user: req.user.id,
      type: "geofence",
      location: req.body.location,
      zone: req.body.zone,
      timestamp: new Date()
    });
    res.status(201).json({ success: true, alert });
  } catch (err) {
    next(err);
  }
}

// Restricted Zone Alert
async function restrictedZoneAlert(req, res, next) {
  try {
    const alert = await Alert.create({
      user: req.user.id,
      type: "restricted",
      location: req.body.location,
      zone: req.body.zone,
      timestamp: new Date()
    });
    res.status(201).json({ success: true, alert });
  } catch (err) {
    next(err);
  }
}

module.exports = { panicAlert, geoFenceAlert, restrictedZoneAlert };
