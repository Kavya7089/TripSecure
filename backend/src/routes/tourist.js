// routes/tourist.js
const express = require("express");
const router = express.Router();
const { registerTourist, issueTouristHandler } = require("../controllers/touristController");
const auth = require("../middleware/auth");

// Blockchain issue endpoint
router.post("/issue", issueTouristHandler);

// Register Tourist Profile + Blockchain ID
router.post("/", auth, registerTourist);

module.exports = router;
