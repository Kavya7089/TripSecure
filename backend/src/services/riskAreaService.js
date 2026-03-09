// src/services/riskAreaService.js
const supabase = require('../config/db');

// 🔹 Add a new risk area
async function addRiskArea({ name, latitude, longitude, radius, description }) {
  const { data, error } = await supabase.from('riskAreas').insert([{
    name, latitude, longitude, radius, description, createdAt: new Date().toISOString()
  }]).select().single();
  if (error) throw error;
  return data;
}

// 🔹 Get all risk areas
async function getAllRiskAreas() {
  const { data, error } = await supabase.from('riskAreas').select('*');
  if (error) throw error;
  return data || [];
}

// 🔹 Check if a location is inside any risk area
async function isLocationInRiskArea(lat, lon) {
  const riskAreas = await getAllRiskAreas();

  function distance(lat1, lon1, lat2, lon2) {
    // Haversine formula
    const R = 6371000; // meters
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  for (const area of riskAreas) {
    const dist = distance(lat, lon, area.latitude, area.longitude);
    if (dist <= area.radius) return area; // return first matching risk area
  }
  return null;
}

// 🔹 Export functions
module.exports = {
  addRiskArea,
  getAllRiskAreas,
  isLocationInRiskArea,
};
