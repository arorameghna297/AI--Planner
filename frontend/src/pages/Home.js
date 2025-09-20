import React from 'react';
import { Typography, Button, Box } from '@mui/material';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <Box textAlign="center" mt={8}>
      <Typography variant="h3" gutterBottom>
        Welcome to AI Trip Planner
      </Typography>
      <Typography variant="h6" color="text.secondary" gutterBottom>
        Plan your perfect trip across India, tailored to your interests, budget, and real-time conditions.
      </Typography>
      <Button
        variant="contained"
        color="primary"
        size="large"
        component={Link}
        to="/planner"
        sx={{ mt: 4 }}
      >
        Start Planning
      </Button>
    </Box>
  );
}

export default Home; 