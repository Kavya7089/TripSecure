// controllers/touristController.js
const supabase = require('../config/db');
const { encryptJSON } = require('../services/encryptionService');
const { uploadJSON } = require('../services/ipfsService');
const { computeKycHash, issueTourist } = require('../services/blockchainService');

// Register tourist (encrypt KYC, upload to IPFS, write to blockchain, save in DB)
async function registerTourist(req, res, next) {
  try {
    const { userId, walletAddress, kyc } = req.body;
    
    const { data: user, error: userError } = await supabase.from('users').select('*').eq('id', userId).single();
    if (userError || !user) return res.status(400).json({ message: 'User not found' });

    const enc = encryptJSON(kyc);
    const cid = await uploadJSON(enc);
    const kycHash = computeKycHash(enc);
    const validUntil = Math.floor(Date.now() / 1000) + 30 * 24 * 3600;

    const blockchainId = await issueTourist(walletAddress, enc, validUntil);

    const { data: tourist, error: touristError } = await supabase.from('tourists').insert([{
      userId: user.id,
      blockchainId,
      kycCid: cid,
      kycHash,
      validUntil: new Date(validUntil * 1000).toISOString(),
      active: true
    }]).select().single();

    if (touristError) throw touristError;

    res.status(201).json({ touristId: tourist.id, blockchainId, kycCid: cid });
  } catch (err) {
    next(err);
  }
}

// Issue tourist directly (simplified blockchain call)
async function issueTouristHandler(req, res) {
  try {
    const { walletAddr, encryptedKycJson, validUntilUnix } = req.body;
    const id = await issueTourist(walletAddr, encryptedKycJson, validUntilUnix);
    res.json({ success: true, id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { registerTourist, issueTouristHandler };
