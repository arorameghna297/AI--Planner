import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, TextField, Alert } from '@mui/material';

function Booking() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [processing, setProcessing] = useState(false);
  const [confirmation, setConfirmation] = useState(null);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => {};
    script.onerror = () => {};
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const openRazorpay = () => {
    if (!window.Razorpay) return false;
    const options = {
      key: 'rzp_test_xxxxxxxxxxxxx',
      amount: 50000,
      currency: 'INR',
      name: 'AI Trip Planner',
      description: 'Trip booking payment',
      handler: function (response) {
        setConfirmation({ status: 'confirmed', bookingId: response.razorpay_payment_id || 'EMT12345' });
        setProcessing(false);
      },
      prefill: {
        name,
        email,
      },
      theme: { color: '#1976d2' },
    };
    const rzp = new window.Razorpay(options);
    rzp.open();
    return true;
  };

  const handleBook = async (e) => {
    e.preventDefault();
    setProcessing(true);
    const opened = openRazorpay();
    if (!opened) {
      setTimeout(() => {
        setConfirmation({ status: 'confirmed', bookingId: 'EMT12345' });
        setProcessing(false);
      }, 1500);
    }
  };

  return (
    <Box maxWidth={400} mx="auto" mt={4}>
      <Typography variant="h4" gutterBottom>
        Booking & Payment
      </Typography>
      {confirmation ? (
        <Alert severity="success">
          Booking Confirmed!<br />
          Booking ID: {confirmation.bookingId}
        </Alert>
      ) : (
        <form onSubmit={handleBook}>
          <TextField
            label="Name"
            fullWidth
            margin="normal"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <TextField
            label="Email"
            type="email"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            size="large"
            disabled={processing}
            sx={{ mt: 2 }}
          >
            {processing ? 'Processing...' : 'Pay & Book'}
          </Button>
        </form>
      )}
    </Box>
  );
}

export default Booking; 