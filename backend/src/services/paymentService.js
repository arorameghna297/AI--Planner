async function processPayment(paymentInfo) {
  // Call payment gateway API (Razorpay/Stripe)
  // return await paymentApi.charge(paymentInfo);
  return { success: true, transactionId: 'TXN123' };
}

module.exports = { processPayment }; 