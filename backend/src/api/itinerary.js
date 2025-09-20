const express = require('express');
const router = express.Router();
const { generateItinerary } = require('../services/itineraryService');

router.post('/', async (req, res) => {
  try {
    const { userId, preferences } = req.body;
    const itinerary = await generateItinerary(userId, preferences);
    res.json({ itinerary });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router; 