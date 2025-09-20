async function bookWithEMT(itinerary) {
  // Call EMT API to book itinerary
  // return await emtApi.book(itinerary);
  return { status: 'confirmed', bookingId: 'EMT12345' };
}

module.exports = { bookWithEMT }; 