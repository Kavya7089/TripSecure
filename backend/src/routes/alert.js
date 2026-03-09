const express = require("express");
const router = express.Router();
const { panicAlert, geoFenceAlert, restrictedZoneAlert } = require("../controllers/alertController");
const auth = require("../middleware/auth");
const { sendAlertEmail } = require("../services/alertService");


// @desc    Panic Button (SOS) Alert
// @route   POST /api/alerts/panic
// @access  Private


// @desc    GeoFence Alert
// @route   POST /api/alerts/geofence
// @access  Private
router.post("/geofence", auth, geoFenceAlert);

// @desc    Restricted Zone Alert
// @route   POST /api/alerts/restricted
// @access  Private
router.post("/restricted", auth, restrictedZoneAlert);
// backend/routes/alertRoutes.js





// Panic alert endpoint
// router.post("/", async (req, res) => {
//   try {
//     const { userId, location, description } = req.body;

//     if (!userId) return res.status(400).json({ message: "userId is required" });

//     const alert = await Alert.create({
//       user: userId,   // ✅ attach MongoDB userId here
//       location,
//       description,
//     });

//     res.json({ success: true, alert });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: err.message });
//   }
// });

// const { createAlert } = require("../controllers/alertController");


const authMiddleware = require("../middleware/auth");

router.post("/", authMiddleware, panicAlert);







module.exports = router;
