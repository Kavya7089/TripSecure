const express = require("express");
const router = express.Router();
const { addFeedback, getFeedback } = require("../controllers/feedbackController");
const auth = require("../middleware/auth");

// @desc    Add Tourist Feedback
// @route   POST /api/feedback
// @access  Private
router.post("/", auth, addFeedback);

// @desc    Get All Feedback
// @route   GET /api/feedback
// @access  Public
router.get("/", getFeedback);

module.exports = router;
