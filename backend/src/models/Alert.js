const mongoose = require("mongoose");

const alertSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  type: { type: String, enum: ["panic", "geofence", "restricted"], required: true },
  location: { type: String }, // could be lat/long or place name
  zone: { type: String },     // optional: restricted zone or geofence name
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Alert", alertSchema);
