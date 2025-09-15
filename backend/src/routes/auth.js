const express = require("express");
const router = express.Router();
const authController = require('../controllers/authController');

// @desc    Register a new user (Tourist / Admin)
// @route   POST /api/auth/register
// @access  Public
router.post("/register", authController.register);

// @desc    Login user & get token
// @route   POST /api/auth/login
// @access  Public
router.post('/login', authController.login);

module.exports = router;
