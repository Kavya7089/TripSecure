const mongoose = require('mongoose');

const touristSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  blockchainId: { type: Number }, // id returned by smart contract
  kycCid: { type: String }, // IPFS CID for encrypted KYC
  kycHash: { type: String }, // keccak256 hash stored on-chain
  validUntil: { type: Date },
  active: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Tourist', touristSchema);
