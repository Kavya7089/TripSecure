import axios from "axios";

const AI_API_URL = "http://localhost:8001"; // change if deployed elsewhere

export const analyzeTrip = async (trip) => {
  try {
    const response = await axios.post(`${AI_API_URL}/analyze-trip`, trip);
    return response.data; // { risk_score, suggestion }
  } catch (error) {
    console.error("AI API error:", error.message);
    throw error;
  }
};
