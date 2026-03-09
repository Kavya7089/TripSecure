// backend/src/routes/userRoutes.js
const express = require("express");
const router = express.Router();
const supabase = require('../config/db');

// Save push token
router.post("/push-token", async (req, res) => {
  try {
    const { userId, pushToken } = req.body;
    if (!userId || !pushToken) {
      return res.status(400).json({ message: "userId and pushToken required" });
    }

    const { data: user, error } = await supabase.from('users').select('*').eq('id', userId).single();
    if (error || !user) return res.status(404).json({ message: "User not found" });

    const { error: updateError } = await supabase.from('users').update({ pushToken }).eq('id', userId);
    if (updateError) throw updateError;

    res.json({ success: true, message: "Push token saved" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
