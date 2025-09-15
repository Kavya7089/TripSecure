const axios = require('axios');
const { aiUrl } = require('../config');

async function predictFeatures(features) {
  if (!aiUrl) throw new Error('AI service URL not configured');
  const res = await axios.post(`${aiUrl}/predict_from_features`, features, { timeout: 5000 });
  return res.data;
}

module.exports = { predictFeatures };
