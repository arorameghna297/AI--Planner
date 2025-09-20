const fetch = global.fetch;

async function getPlaces(preferences) {
  // Call Google Maps Places API based on preferences (stub)
  return [{ name: 'Amber Fort', type: 'heritage' }];
}

async function getEvents(preferences) {
  // Call events API or Google Maps for local events (stub)
  return [{ name: 'Cultural Show', date: '2025-09-20' }];
}

function priceLevelToRupees(priceLevel) {
  if (priceLevel === undefined || priceLevel === null) return null;
  const level = Math.max(0, Math.min(4, Number(priceLevel)));
  return '₹'.repeat(level || 1);
}

async function getHotels({ destination, budget }) {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  if (!apiKey || !destination) {
    // Fallback minimal if no key or destination provided
    return [
      { name: 'Hotel Royale', rating: 4.3, pricePerNight: 3500, url: 'https://www.google.com/maps/search/?api=1&query=Hotel%20Royale' },
      { name: 'Heritage Stay', rating: 4.6, pricePerNight: 5200, url: 'https://www.google.com/maps/search/?api=1&query=Heritage%20Stay' },
      { name: 'Budget Inn', rating: 3.9, pricePerNight: 1800, url: 'https://www.google.com/maps/search/?api=1&query=Budget%20Inn' }
    ].slice(0, 5);
  }

  try {
    const query = `hotels in ${destination}`;
    const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(query)}&type=lodging&key=${encodeURIComponent(apiKey)}`;
    const res = await fetch(url);
    const data = await res.json();
    const results = Array.isArray(data.results) ? data.results : [];
    const hotels = results.slice(0, 5).map(r => {
      const mapsPlaceUrl = r.place_id
        ? `https://www.google.com/maps/place/?q=place_id:${r.place_id}`
        : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(r.name + ' ' + (destination || ''))}`;
      return {
        name: r.name,
        rating: r.rating,
        priceLevel: r.price_level,
        priceLevelSymbol: priceLevelToRupees(r.price_level),
        address: r.formatted_address,
        url: mapsPlaceUrl
      };
    });

    // Optional: naive budget filter using price_level
    if (budget) {
      const numericBudget = Number(budget);
      if (!Number.isNaN(numericBudget)) {
        // If budget is low, bias to lower price levels
        const filtered = hotels.filter(h => (h.priceLevel ?? 2) <= (numericBudget < 3000 ? 2 : 4));
        return filtered.length ? filtered : hotels;
      }
    }

    return hotels;
  } catch (e) {
    // On any failure, return minimal fallback
    return [
      { name: 'Hotel Royale', rating: 4.3, pricePerNight: 3500, url: 'https://www.google.com/maps/search/?api=1&query=Hotel%20Royale' },
      { name: 'Heritage Stay', rating: 4.6, pricePerNight: 5200, url: 'https://www.google.com/maps/search/?api=1&query=Heritage%20Stay' },
      { name: 'Budget Inn', rating: 3.9, pricePerNight: 1800, url: 'https://www.google.com/maps/search/?api=1&query=Budget%20Inn' }
    ].slice(0, 5);
  }
}

module.exports = { getPlaces, getEvents, getHotels }; 