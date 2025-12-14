const express = require('express');
const router = express.Router();
const Trip = require('../models/Trip');

// GET all trips for a user
router.get('/', async (req, res) => {
  try {
    const { userId } = req.query;
    const trips = await Trip.find({ userId }).sort({ startDate: 1 });
    res.json(trips);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- TRACKER ROUTE: GET SINGLE TRIP ---
router.get('/:id', async (req, res) => {
  console.log("🔎 SEARCHING FOR TRIP ID:", req.params.id); // <--- Tracker Log 1

  try {
    const trip = await Trip.findById(req.params.id);
    
    if (!trip) {
      console.log("❌ TRIP NOT FOUND IN DB"); // <--- Tracker Log 2
      return res.status(404).json({ error: "Trip not found" });
    }

    console.log("✅ TRIP FOUND:", trip.destination); // <--- Tracker Log 3
    res.json(trip);
  } catch (err) {
    console.error("💥 SERVER ERROR:", err.message);
    res.status(500).json({ error: err.message });
  }
});
// ----------------------------------------

// POST a new trip
router.post('/', async (req, res) => {
  try {
    const newTrip = new Trip(req.body);
    const savedTrip = await newTrip.save();
    res.status(201).json(savedTrip);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT (Update) a trip
router.put('/:id', async (req, res) => {
  try {
    const updatedTrip = await Trip.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true }
    );
    res.json(updatedTrip);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE a trip
router.delete('/:id', async (req, res) => {
  try {
    await Trip.findByIdAndDelete(req.params.id);
    res.json({ message: 'Trip deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;