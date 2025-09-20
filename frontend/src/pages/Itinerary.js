import React, { useState } from 'react';
import { Box, Typography, Card, CardContent, Button, Stack, Divider, IconButton, Link as MuiLink } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';

function Itinerary() {
  const initial = JSON.parse(localStorage.getItem('itinerary') || '{}');
  const navigate = useNavigate();

  if (!initial.days) {
    return (
      <Box textAlign="center" mt={8}>
        <Typography variant="h6">No itinerary found. Please plan your trip first.</Typography>
        <Button variant="contained" color="primary" sx={{ mt: 2 }} onClick={() => navigate('/planner')}>
          Plan Trip
        </Button>
      </Box>
    );
  }

  const [itinerary, setItinerary] = useState(initial);
  const hotels = itinerary.hotels || [];

  const moveActivity = (dayIndex, fromIndex, toIndex) => {
    if (toIndex < 0 || toIndex >= itinerary.days[dayIndex].activities.length) return;
    const updated = { ...itinerary };
    const items = [...updated.days[dayIndex].activities];
    const [moved] = items.splice(fromIndex, 1);
    items.splice(toIndex, 0, moved);
    updated.days[dayIndex].activities = items;
    setItinerary(updated);
    localStorage.setItem('itinerary', JSON.stringify(updated));
  };

  const heroUrl = itinerary.meta?.to
    ? `https://source.unsplash.com/1600x400/?${encodeURIComponent(itinerary.meta.to)}%20city%20india`
    : `https://source.unsplash.com/1600x400/?india%20travel`;

  return (
    <Box mt={0}>
      <Box sx={{ width: '100%', height: 240, backgroundColor: '#ddd', backgroundImage: `url(${heroUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />

      <Box mt={4}>
        <Typography variant="h4" gutterBottom>
          Your Itinerary
        </Typography>

        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
          {itinerary.meta?.from} → {itinerary.meta?.to} | {itinerary.meta?.startDate} to {itinerary.meta?.endDate} | {itinerary.meta?.travelerType}
        </Typography>

        <Stack spacing={2}>
          {itinerary.days.map((day, idx) => (
            <Card key={idx} variant="outlined">
              <CardContent>
                <Typography variant="h6">Day {day.day}</Typography>
                <ul style={{ listStyle: 'none', padding: 0 }}>
                  {day.activities.map((activity, i) => (
                    <li key={`${idx}-${i}`}
                        style={{
                          background: '#fff',
                          marginBottom: 8,
                          padding: '8px 12px',
                          borderRadius: 6,
                          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between'
                        }}
                    >
                      <span>{activity}</span>
                      <span>
                        <IconButton size="small" aria-label="move up" onClick={() => moveActivity(idx, i, i - 1)} disabled={i === 0}>
                          <ArrowUpwardIcon fontSize="inherit" />
                        </IconButton>
                        <IconButton size="small" aria-label="move down" onClick={() => moveActivity(idx, i, i + 1)} disabled={i === day.activities.length - 1}>
                          <ArrowDownwardIcon fontSize="inherit" />
                        </IconButton>
                      </span>
                    </li>
                  ))}
                </ul>
                {day.notes && (
                  <Typography variant="body2" color="text.secondary">Note: {day.notes}</Typography>
                )}
              </CardContent>
            </Card>
          ))}
        </Stack>

        <Typography variant="h5" mt={4} gutterBottom>
          Suggested Hotels
        </Typography>
        <Stack spacing={2}>
          {hotels.map((h, i) => (
            <Card key={i} variant="outlined">
              <CardContent>
                <Typography variant="h6">
                  <MuiLink href={h.url || '#'} target="_blank" rel="noopener noreferrer" underline="hover">
                    {h.name}
                  </MuiLink>
                </Typography>
                {h.rating !== undefined && (
                  <Typography variant="body2">Rating: {h.rating} ⭐</Typography>
                )}
                {h.pricePerNight && (
                  <Typography variant="body2">Approx. ₹{h.pricePerNight}/night</Typography>
                )}
                {h.priceLevelSymbol && (
                  <Typography variant="body2">Price level: {h.priceLevelSymbol}</Typography>
                )}
                {h.address && (
                  <Typography variant="body2" color="text.secondary">{h.address}</Typography>
                )}
              </CardContent>
            </Card>
          ))}
          {hotels.length === 0 && (
            <Typography>No hotels found for your filters. Adjust budget or region.</Typography>
          )}
        </Stack>

        <Typography variant="h5" mt={4} gutterBottom>
          Transport
        </Typography>
        <Card variant="outlined">
          <CardContent>
            <Typography variant="subtitle1">Flight</Typography>
            <Typography variant="body2" gutterBottom>{itinerary.transport?.flight?.suggestion || 'No flight suggestion'}</Typography>
            <Typography variant="subtitle1">Local</Typography>
            <Typography variant="body2">Modes: {(itinerary.transport?.local?.modes || []).join(', ') || 'N/A'}</Typography>
            <Typography variant="body2">{itinerary.transport?.local?.notes || ''}</Typography>
          </CardContent>
        </Card>

        <Divider sx={{ my: 3 }} />

        <Typography variant="h6">Estimated Trip Cost: ₹{itinerary.cost}</Typography>
        <Stack direction="row" spacing={2} mt={2}>
          <Button variant="contained" color="primary" onClick={() => navigate('/booking')}>
            Book Flight
          </Button>
          <Button variant="outlined" color="primary" onClick={() => navigate('/booking')}>
            Book Hotel
          </Button>
          <Button variant="outlined" color="secondary" onClick={() => navigator.clipboard.writeText(window.location.href)}>
            Share Itinerary
          </Button>
        </Stack>
      </Box>
    </Box>
  );
}

export default Itinerary; 