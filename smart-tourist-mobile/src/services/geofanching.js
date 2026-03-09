import axios from "axios";
import { FULL_URL } from "../config";

const geoAPI = axios.create({
  baseURL: `${FULL_URL}/geofencing`,
  timeout: 15000,
});

/**
 * Fetch all geofencing zones
 */
export async function getZones() {
  try {
    const response = await geoAPI.get("/zones");
    return response.data;
  } catch (err) {
    console.error("Error fetching geofencing zones:", err);
    throw err;
  }
}

/**
 * Check if a location is inside any restricted zone
 * @param {number} latitude
 * @param {number} longitude
 */
export async function checkLocation(latitude, longitude) {
  try {
    const response = await geoAPI.post("/check", { latitude, longitude });
    return response.data; // { inRestrictedZone: true/false, zoneId: "..." }
  } catch (err) {
    console.error("Error checking location:", err);
    throw err;
  }
}

/**
 * Create or update a geofence zone
 * @param {Object} zoneData { name, coordinates, radius, type }
 */
export async function saveZone(zoneData) {
  try {
    const response = await geoAPI.post("/zones", zoneData);
    return response.data;
  } catch (err) {
    console.error("Error saving geofence zone:", err);
    throw err;
  }
}

export default {
  getZones,
  checkLocation,
  saveZone,
};
