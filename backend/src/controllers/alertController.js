// controllers/alertController.js
const supabase = require('../config/db');
const nodemailer = require("nodemailer");
require("dotenv").config();

async function panicAlert(req, res, next) {
  try {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });

    const { data: alert, error } = await supabase.from('alerts').insert([{
      userId: req.user.id,
      type: "panic",
      location: req.body.location,
      description: req.body.description || "Panic triggered",
      timestamp: new Date().toISOString(),
    }]).select().single();

    if (error) throw error;

    // Send email to admins
    const emails = process.env.ADMIN_EMAILS ? process.env.ADMIN_EMAILS.split(",").map(email => email.trim()) : [];

    if (emails.length) {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.GMAIL_USER,
          pass: process.env.GMAIL_PASS,
        },
      });
      const {latitude, longitude} = req.body.location || {};
      const locationLink = latitude && longitude ? `https://www.google.com/maps?q=${latitude},${longitude}` : "Location not provided";

      await transporter.sendMail({
        from: process.env.GMAIL_USER,
        to: emails,
        subject: "🚨 Panic Alert Triggered",
        text: `User ${req.user.name} triggered a panic alert at location: ${locationLink}`,
      }).catch(err => console.error("Email send failed:", err));
    }

    res.status(201).json({ success: true, alert });
  } catch (err) {
    next(err);
  }
}

// GeoFence Alert
async function geoFenceAlert(req, res, next) {
  try {
    const { data: alert, error } = await supabase.from('alerts').insert([{
      userId: req.user.id,
      type: "geofence",
      location: req.body.location,
      zone: req.body.zone,
      timestamp: new Date().toISOString(),
    }]).select().single();
    
    if (error) throw error;

    res.status(201).json({ success: true, alert });
  } catch (err) {
    next(err);
  }
}

// Restricted Zone Alert
async function restrictedZoneAlert(req, res, next) {
  try {
    const { data: alert, error } = await supabase.from('alerts').insert([{
      userId: req.user.id,
      type: "restricted",
      location: req.body.location,
      zone: req.body.zone,
      timestamp: new Date().toISOString(),
    }]).select().single();

    if (error) throw error;

    res.status(201).json({ success: true, alert });
  } catch (err) {
    next(err);
  }
}

module.exports = { panicAlert, geoFenceAlert, restrictedZoneAlert };
