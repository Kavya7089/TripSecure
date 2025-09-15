const mongoose = require('mongoose');

const incidentSchema = new mongoose.Schema({
  tourist: { type: mongoose.Schema.Types.ObjectId, ref: 'Tourist', required: true },
  incidentChainId: { type: Number }, // chain incident id
  locationCid: { type: String },
  evidenceCid: { type: String },
  descriptionCid: { type: String },
  reporter: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now },
  handled: { type: Boolean, default: false }
});

module.exports = mongoose.model('Incident', incidentSchema);
