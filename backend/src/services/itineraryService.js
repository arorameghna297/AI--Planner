const { getAIItinerary } = require('../ai/itineraryAI');
const { getPlaces, getEvents, getHotels } = require('../integrations/maps');

async function generateItinerary(userId, preferences) {
  const places = await getPlaces(preferences);
  const events = await getEvents(preferences);
  const searchedHotels = await getHotels({ destination: preferences.to, budget: preferences.budget });

  const aiPlan = await getAIItinerary({ preferences, places, events, hotels: searchedHotels });

  // Prefer hotels returned by AI if present; otherwise use our search
  const hotels = Array.isArray(aiPlan.hotels) && aiPlan.hotels.length ? aiPlan.hotels : searchedHotels;

  return { ...aiPlan, hotels };
}

module.exports = { generateItinerary }; 