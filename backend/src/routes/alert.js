const express = require("express");
const router = express.Router();
const { panicAlert, geoFenceAlert, restrictedZoneAlert } = require("../controllers/alertController");
const auth = require("../middleware/auth");

// @desc    Panic Button (SOS) Alert
// @route   POST /api/alerts/panic
// @access  Private
router.post("/panic", auth, panicAlert);

// @desc    GeoFence Alert
// @route   POST /api/alerts/geofence
// @access  Private
router.post("/geofence", auth, geoFenceAlert);

// @desc    Restricted Zone Alert
// @route   POST /api/alerts/restricted
// @access  Private
router.post("/restricted", auth, restrictedZoneAlert);

module.exports = router;
