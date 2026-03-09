const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const supabase = require('../config/db');
const { jwtSecret, jwtExpiresIn } = require('../config');
const { issueTourist } = require('../services/blockchainService');

async function register(req, res, next) {
  try {
    const { name, email, phone, password, role, aadhaarNumber, passportNumber, walletAddress } = req.body;
    if (!password) return res.status(400).json({ message: 'Password required' });

    const pwHash = await bcrypt.hash(password, 10);

    // Build KYC
    const kycData = {
      aadhaarNumber: aadhaarNumber || null,
      passportNumber: passportNumber || null,
      phone,
      email,
    };

    // Register tourist on blockchain
    const validUntilUnix = Math.floor(Date.now() / 1000) + (365 * 24 * 60 * 60); // 1 year
    const touristId = await issueTourist(walletAddress, kycData, validUntilUnix);

    // Save in Supabase
    const { data: user, error } = await supabase.from('users').insert([{
      name,
      email,
      phone,
      passwordHash: pwHash,
      role: role || 'TOURIST',
      walletAddress,
      aadhaarNumber,
      passportNumber,
      blockchainTouristId: touristId,
    }]).select().single();

    if (error) throw error;

    res.status(201).json({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      blockchainTouristId: touristId,
    });
  } catch (err) {
    next(err);
  }
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    // Find user
    const { data: user, error } = await supabase.from('users').select('*').eq('email', email).single();
    if (error || !user) {
      return res.status(400).json({ success: false, message: 'User not found' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Invalid credentials' });
    }

    // Generate JWT
    const token = jwt.sign(
      { id: user.id, role: user.role },
      jwtSecret,
      { expiresIn: jwtExpiresIn || '7d' }
    );

    // Return token + user info
    res.status(200).json({
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        blockchainTouristId: user.blockchainTouristId,
        walletAddress: user.walletAddress,
      },
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { register, login };
