import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Container, Box } from '@mui/material';
import Home from './pages/Home';
import Planner from './pages/Planner';
import Itinerary from './pages/Itinerary';
import Booking from './pages/Booking';
import './styles.css';

function App() {
  return (
    <Router>
      <AppBar position="static" color="primary">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            AI Trip Planner
          </Typography>
          <Button color="inherit" component={Link} to="/">Home</Button>
          <Button color="inherit" component={Link} to="/planner">Plan Trip</Button>
          <Button color="inherit" component={Link} to="/itinerary">Itinerary</Button>
          <Button color="inherit" component={Link} to="/booking">Booking</Button>
        </Toolbar>
      </AppBar>
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Box sx={{ my: 4 }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/planner" element={<Planner />} />
            <Route path="/itinerary" element={<Itinerary />} />
            <Route path="/booking" element={<Booking />} />
          </Routes>
        </Box>
      </Container>
    </Router>
  );
}

export default App; 