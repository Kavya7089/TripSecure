import axios from "axios";
import { FULL_URL } from "../config"; // Base URL of your backend / blockchain API

const blockchainAPI = axios.create({
  baseURL: `${FULL_URL}/blockchain`,
  timeout: 15000,
});

/**
 * Register a tourist's digital ID
 * @param {string} userId
 * @param {string} walletAddress
 * @param {Object} kycData
 */
export async function registerDigitalID(userId, walletAddress, kycData) {
  try {
    const response = await blockchainAPI.post("/register", {
      userId,
      walletAddress,
      kycData,
    });
    return response.data;
  } catch (err) {
    console.error("Error registering digital ID:", err);
    throw err;
  }
}

/**
 * Log a tourist action or event
 * @param {string} userId
 * @param {string} action
 * @param {Object} metadata
 */
export async function logAction(userId, action, metadata = {}) {
  try {
    const response = await blockchainAPI.post("/log", {
      userId,
      action,
      metadata,
    });
    return response.data;
  } catch (err) {
    console.error("Error logging action:", err);
    throw err;
  }
}

export default {
  registerDigitalID,
  logAction,
};
