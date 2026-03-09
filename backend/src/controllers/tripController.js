// controllers/tripController.js
const supabase = require('../config/db');

// Create a trip
async function createTrip(req, res, next) {
  try {
    const { data, error } = await supabase.from('trips').insert([req.body]).select().single();
    if (error) throw error;
    res.status(201).json(data);
  } catch (err) {
    next(err);
  }
}

// Get trip by ID
async function getTrip(req, res, next) {
  try {
    const { data, error } = await supabase.from('trips').select('*').eq('id', req.params.id).single();
    if (error) {
      if (error.code === 'PGRST116') return res.status(404).json({ message: "Trip not found" });
      throw error;
    }
    res.json(data);
  } catch (err) {
    next(err);
  }
}

// Update trip
async function updateTrip(req, res, next) {
  try {
    const { data, error } = await supabase.from('trips').update(req.body).eq('id', req.params.id).select().single();
    if (error) throw error;
    if (!data) return res.status(404).json({ message: "Trip not found" });
    res.json(data);
  } catch (err) {
    next(err);
  }
}

module.exports = { createTrip, getTrip, updateTrip };
