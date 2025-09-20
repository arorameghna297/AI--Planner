const { bookWithEMT } = require('../integrations/emt');
const { processPayment } = require('./paymentService');

async function bookItinerary(itinerary, paymentInfo) {
  // 1. Process payment
  const paymentResult = await processPayment(paymentInfo);
  if (!paymentResult.success) throw new Error('Payment failed');

  // 2. Book with EMT
  const bookingConfirmation = await bookWithEMT(itinerary);

  // 3. Return confirmation
  return bookingConfirmation;
}

module.exports = { bookItinerary }; 