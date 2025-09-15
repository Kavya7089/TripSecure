const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { jwtSecret, jwtExpiresIn } = require('../config');

async function register(req, res, next) {
  try {
    const { name, email, phone, password, role } = req.body;
    if (!password) return res.status(400).json({ message: 'Password required' });
    const pwHash = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, phone, passwordHash: pwHash, role: role || 'TOURIST' });
    res.status(201).json({ id: user._id, email: user.email });
  } catch (err) { next(err); }
}

async function login(req, res) {
  res.json({ message: "Login works!" });
}

module.exports = { register, login };
