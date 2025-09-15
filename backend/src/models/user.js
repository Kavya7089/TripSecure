const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String },
  email: { type: String, index: true, unique: true, sparse: true },
  phone: { type: String, index: true, unique: true, sparse: true },
  passwordHash: { type: String },
  role: { type: String, enum: ['ADMIN','ISSUER','LOGGER','TOURIST','FAMILY'], default: 'TOURIST' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
