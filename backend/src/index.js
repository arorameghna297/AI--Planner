const express = require('express');
const bodyParser = require('body-parser');
const itineraryRoutes = require('./api/itinerary');
const bookingRoutes = require('./api/booking');
const userRoutes = require('./api/user');
require('dotenv').config();

const app = express();
app.use(bodyParser.json());

// Routes
app.use('/api/itinerary', itineraryRoutes);
app.use('/api/book', bookingRoutes);
app.use('/api/user', userRoutes);

app.get('/', (req, res) => res.send('Trip Planner Backend Running!'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`)); 