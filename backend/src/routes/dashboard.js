const express = require("express");
const router = express.Router();
const { getTouristHeatmap, getDigitalIDs, getAlerts } = require("../controllers/dashboardController");
const auth = require("../middleware/auth");

// @desc    Get Real-time Tourist Heatmap
// @route   GET /api/dashboard/heatmap
// @access  Admin
router.get("/heatmap", auth, getTouristHeatmap);

// @desc    Get All Tourist Digital IDs
// @route   GET /api/dashboard/ids
// @access  Admin
router.get("/ids", auth, getDigitalIDs);

// @desc    Get All Alerts
// @route   GET /api/dashboard/alerts
// @access  Admin
router.get("/alerts", auth, getAlerts);

module.exports = router;
