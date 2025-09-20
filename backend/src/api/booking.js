const express = require('express');
const router = express.Router();
const { bookItinerary } = require('../services/bookingService');

router.post('/', async (req, res) => {
  try {
    const { itinerary, paymentInfo } = req.body;
    const bookingConfirmation = await bookItinerary(itinerary, paymentInfo);
    res.json({ bookingConfirmation });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router; 