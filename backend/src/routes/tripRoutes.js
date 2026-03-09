// routes/tripRoutes.js
const express = require("express");
const router = express.Router();
const { analyzeTrip } = require("../services/aiService");

router.post("/analyze", async (req, res) => {
  try {
    const result = await analyzeTrip(req.body);
    res.json(result);
  } catch (err) {
    console.error("AI analyze error:", err.message);
    res.status(500).json({ error: "AI analysis failed" });
  }
});
// backend-api/routes/tripRoutes.js
router.put('/:tripId', tripController.updateTrip);

module.exports = router;
