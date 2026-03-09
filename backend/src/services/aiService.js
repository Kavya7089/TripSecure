// services/aiService.js
const axios = require("axios");

const AI_ENGINE_URL = "http://localhost:8001/predict";

async function analyzeTrip(data) {
  const response = await axios.post(AI_ENGINE_URL, data);
  return response.data;
}

module.exports = { analyzeTrip };
