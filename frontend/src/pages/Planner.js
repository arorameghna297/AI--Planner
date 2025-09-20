import React, { useState } from 'react';
import { Box, Typography, TextField, Button, Chip, Stack, MenuItem, ToggleButtonGroup, ToggleButton, Backdrop, CircularProgress, Autocomplete, Card, CardContent, CardMedia, IconButton } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import FavoriteIcon from '@mui/icons-material/Favorite';
import SelfImprovementIcon from '@mui/icons-material/SelfImprovement';
import ExploreIcon from '@mui/icons-material/Explore';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

const moodboardOptions = [
  { key: 'romantic', label: 'Romantic', icon: <FavoriteIcon fontSize="small" />, color: 'secondary' },
  { key: 'calm', label: 'Calm', icon: <SelfImprovementIcon fontSize="small" />, color: 'primary' },
  { key: 'exploring', label: 'Exploring', icon: <ExploreIcon fontSize="small" />, color: 'primary' }
];
const interestsList = ['Heritage', 'Nightlife', 'Adventure', 'Nature', 'Food', 'Shopping', 'Wellness', 'Festivals'];

const popularCities = [
  'Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 'Kolkata', 'Pune', 'Ahmedabad', 'Jaipur', 'Surat',
  'Lucknow', 'Kanpur', 'Nagpur', 'Indore', 'Thane', 'Bhopal', 'Visakhapatnam', 'Pimpri-Chinchwad', 'Patna', 'Vadodara',
  'Ghaziabad', 'Ludhiana', 'Agra', 'Nashik', 'Faridabad', 'Meerut', 'Rajkot', 'Kalyan-Dombivali', 'Vasai-Virar', 'Varanasi',
  'Srinagar', 'Aurangabad', 'Navi Mumbai', 'Solapur', 'Vijayawada', 'Kolhapur', 'Amritsar', 'Sangli', 'Malegaon',
  'Ulhasnagar', 'Jalgaon', 'Akola', 'Latur', 'Ahmadnagar', 'Dhule', 'Ichalkaranji', 'Parbhani', 'Jalna', 'Bhusawal',
  'Panchkula', 'Karnal', 'Hisar', 'Fatehabad', 'Sirsa', 'Ambala', 'Yamunanagar', 'Kaithal', 'Kurukshetra', 'Rewari',
  'Rohtak', 'Bhiwani', 'Sonipat', 'Jind', 'Panipat', 'Gurgaon', 'Palwal', 'Nuh', 'Mewat', 'Goa', 'Kochi', 'Mysore',
  'Madurai', 'Coimbatore', 'Tiruchirappalli', 'Salem', 'Tirunelveli', 'Erode', 'Vellore', 'Thoothukkudi', 'Dindigul',
  'Thanjavur', 'Ranchi', 'Jamshedpur', 'Dhanbad', 'Bokaro', 'Deoghar', 'Phusro', 'Hazaribagh', 'Giridih', 'Ramgarh',
  'Jammu', 'Srinagar', 'Anantnag', 'Baramulla', 'Sopore', 'Kathua', 'Udhampur', 'Rajauri', 'Punch', 'Doda'
];

const monthlyDestinations = {
  'January': [
    { name: 'Goa', vibe: 'Friends, Exploring', description: 'Perfect weather for beach parties' },
    { name: 'Kerala', vibe: 'Solo, Calm', description: 'Serene backwaters and Ayurveda' },
    { name: 'Rajasthan', vibe: 'Romantic, Heritage', description: 'Desert palaces and cultural heritage' }
  ],
  'February': [
    { name: 'Andaman', vibe: 'Romantic, Calm', description: 'Crystal clear waters and pristine beaches' },
    { name: 'Kashmir', vibe: 'Solo, Exploring', description: 'Snow-capped mountains and valleys' },
    { name: 'Mysore', vibe: 'Heritage, Foodie', description: 'Royal heritage and South Indian cuisine' }
  ],
  'March': [
    { name: 'Himachal Pradesh', vibe: 'Friends, Adventure', description: 'Trekking and adventure sports' },
    { name: 'Pondicherry', vibe: 'Solo, Calm', description: 'French colonial charm and beaches' },
    { name: 'Varanasi', vibe: 'Spiritual, Exploring', description: 'Spiritual journey along the Ganges' }
  ],
  'April': [
    { name: 'Ladakh', vibe: 'Adventure, Solo', description: 'High altitude lakes and monasteries' },
    { name: 'Coorg', vibe: 'Romantic, Calm', description: 'Coffee plantations and misty hills' },
    { name: 'Udaipur', vibe: 'Romantic, Heritage', description: 'City of lakes and royal palaces' }
  ],
  'May': [
    { name: 'Manali', vibe: 'Friends, Adventure', description: 'Cool mountain retreat' },
    { name: 'Munnar', vibe: 'Solo, Calm', description: 'Tea gardens and peaceful hills' },
    { name: 'Shimla', vibe: 'Family, Exploring', description: 'Colonial hill station charm' }
  ],
  'June': [
    { name: 'Darjeeling', vibe: 'Solo, Calm', description: 'Tea gardens and mountain views' },
    { name: 'Ooty', vibe: 'Family, Exploring', description: 'Queen of hill stations' },
    { name: 'Mahabaleshwar', vibe: 'Romantic, Calm', description: 'Strawberry farms and scenic views' }
  ],
  'July': [
    { name: 'Kodaikanal', vibe: 'Friends, Exploring', description: 'Princess of hill stations' },
    { name: 'Munnar', vibe: 'Solo, Calm', description: 'Monsoon magic in tea gardens' },
    { name: 'Coorg', vibe: 'Romantic, Calm', description: 'Rain-kissed coffee plantations' }
  ],
  'August': [
    { name: 'Lonavala', vibe: 'Friends, Exploring', description: 'Monsoon waterfalls and misty hills' },
    { name: 'Mahabaleshwar', vibe: 'Family, Calm', description: 'Cool monsoon weather' },
    { name: 'Kerala', vibe: 'Solo, Calm', description: 'Backwaters in monsoon season' }
  ],
  'September': [
    { name: 'Rajasthan', vibe: 'Heritage, Exploring', description: 'Festival season begins' },
    { name: 'Goa', vibe: 'Friends, Exploring', description: 'Post-monsoon beach season' },
    { name: 'Kashmir', vibe: 'Romantic, Calm', description: 'Autumn colors and pleasant weather' }
  ],
  'October': [
    { name: 'Rajasthan', vibe: 'Heritage, Foodie', description: 'Festival season and cultural heritage' },
    { name: 'Kerala', vibe: 'Solo, Calm', description: 'Perfect weather for backwaters' },
    { name: 'Himachal Pradesh', vibe: 'Adventure, Friends', description: 'Trekking season begins' }
  ],
  'November': [
    { name: 'Goa', vibe: 'Friends, Exploring', description: 'Peak beach season' },
    { name: 'Kerala', vibe: 'Romantic, Calm', description: 'Ideal backwater weather' },
    { name: 'Rajasthan', vibe: 'Heritage, Exploring', description: 'Perfect desert weather' }
  ],
  'December': [
    { name: 'Goa', vibe: 'Friends, Exploring', description: 'New Year celebrations' },
    { name: 'Kerala', vibe: 'Solo, Calm', description: 'Cool and comfortable weather' },
    { name: 'Rajasthan', vibe: 'Romantic, Heritage', description: 'Desert nights and royal palaces' }
  ]
};

function Planner() {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [travelerType, setTravelerType] = useState('couple');
  const [budget, setBudget] = useState('');
  const [duration, setDuration] = useState('');
  const [region, setRegion] = useState('');
  const [moodboard, setMoodboard] = useState([]);
  const [interests, setInterests] = useState([]);
  const [wishes, setWishes] = useState('');
  const [loading, setLoading] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  const navigate = useNavigate();

  const currentMonth = new Date().toLocaleString('default', { month: 'long' });
  const currentDestinations = monthlyDestinations[currentMonth] || monthlyDestinations['January'];

  const handleChipToggle = (value, setter, state) => {
    setter(state.includes(value) ? state.filter(v => v !== value) : [...state, value]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post('/api/itinerary', {
        userId: 'demo',
        preferences: {
          from, to, startDate, endDate, travelerType,
          budget, duration, region,
          moodboard,
          interests,
          wishes: wishes.split(',').map(w => w.trim().toLowerCase()).filter(Boolean)
        },
      });
      localStorage.setItem('itinerary', JSON.stringify(res.data.itinerary));
      navigate('/itinerary');
    } catch (err) {
      alert('Failed to generate itinerary.');
    } finally {
      setLoading(false);
    }
  };

  const mapSrc = to ? `https://www.google.com/maps?q=${encodeURIComponent(to)}&output=embed` : '';

  const scrollUp = () => {
    setScrollPosition(Math.max(0, scrollPosition - 1));
  };

  const scrollDown = () => {
    setScrollPosition(Math.min(currentDestinations.length - 1, scrollPosition + 1));
  };

  const selectDestination = (destination) => {
    setTo(destination.name);
  };

  const getDestinationImage = (destination) => {
    const searchTerm = encodeURIComponent(`${destination.name} india travel`);
    return `https://source.unsplash.com/300x200/?${searchTerm}`;
  };

  return (
    <Box 
      sx={{
        minHeight: '100vh',
        backgroundImage: 'url(/images/IMG_1517_1.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        position: 'relative',
        display: 'flex',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(255, 255, 255, 0.85)',
          zIndex: 1,
        }
      }}
    >
      <Backdrop open={loading} sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <CircularProgress color="inherit" />
      </Backdrop>
      
      {/* Main Content */}
      <Box 
        sx={{ 
          position: 'relative', 
          zIndex: 2, 
          maxWidth: 700, 
          mx: 'auto', 
          pt: 4, 
          pb: 4,
          px: 2,
          flex: 1
        }}
      >
        <Typography variant="h4" gutterBottom sx={{ textAlign: 'center', mb: 4, color: 'primary.main', fontWeight: 'bold' }}>
          ✈️ Plan Your Dream Trip
        </Typography>
        
        <Box 
          sx={{ 
            backgroundColor: 'rgba(255, 255, 255, 0.95)', 
            borderRadius: 3, 
            p: 4, 
            boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
            backdropFilter: 'blur(10px)'
          }}
        >
          <form onSubmit={handleSubmit}>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <Autocomplete
                freeSolo
                options={popularCities}
                value={from}
                onChange={(event, newValue) => setFrom(newValue || '')}
                onInputChange={(event, newInputValue) => setFrom(newInputValue)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="From"
                    required
                    placeholder="Enter city name"
                    sx={{ backgroundColor: 'rgba(255, 255, 255, 0.8)' }}
                  />
                )}
                sx={{ flex: 1 }}
              />
              <Autocomplete
                freeSolo
                options={popularCities}
                value={to}
                onChange={(event, newValue) => setTo(newValue || '')}
                onInputChange={(event, newInputValue) => setTo(newInputValue)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="To"
                    required
                    placeholder="Enter city name"
                    sx={{ backgroundColor: 'rgba(255, 255, 255, 0.8)' }}
                  />
                )}
                sx={{ flex: 1 }}
              />
            </Stack>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} mt={2}>
              <TextField 
                label="Start Date" 
                type="date" 
                fullWidth 
                InputLabelProps={{ shrink: true }} 
                value={startDate} 
                onChange={(e) => setStartDate(e.target.value)} 
                required 
                sx={{ backgroundColor: 'rgba(255, 255, 255, 0.8)' }}
              />
              <TextField 
                label="End Date" 
                type="date" 
                fullWidth 
                InputLabelProps={{ shrink: true }} 
                value={endDate} 
                onChange={(e) => setEndDate(e.target.value)} 
                required 
                sx={{ backgroundColor: 'rgba(255, 255, 255, 0.8)' }}
              />
            </Stack>
            <Typography variant="subtitle1" mt={2} sx={{ fontWeight: 'bold', color: 'primary.main' }}>Traveler Type</Typography>
            <ToggleButtonGroup color="primary" exclusive value={travelerType} onChange={(e, v) => v && setTravelerType(v)}>
              <ToggleButton value="couple">💕 Couple</ToggleButton>
              <ToggleButton value="family">👨‍👩‍👧‍👦 Family</ToggleButton>
              <ToggleButton value="solo">🧳 Solo</ToggleButton>
            </ToggleButtonGroup>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} mt={2}>
              <TextField 
                label="Budget (INR)" 
                type="number" 
                fullWidth 
                value={budget} 
                onChange={(e) => setBudget(e.target.value)} 
                required 
                sx={{ backgroundColor: 'rgba(255, 255, 255, 0.8)' }}
              />
              <TextField 
                label="Duration (days)" 
                type="number" 
                fullWidth 
                value={duration} 
                onChange={(e) => setDuration(e.target.value)} 
                required 
                sx={{ backgroundColor: 'rgba(255, 255, 255, 0.8)' }}
              />
              <TextField 
                label="Region" 
                select 
                fullWidth 
                value={region} 
                onChange={(e) => setRegion(e.target.value)} 
                required
                sx={{ backgroundColor: 'rgba(255, 255, 255, 0.8)' }}
              >
                <MenuItem value="North">🏔️ North</MenuItem>
                <MenuItem value="South">🌴 South</MenuItem>
                <MenuItem value="East">🌅 East</MenuItem>
                <MenuItem value="West">🌊 West</MenuItem>
                <MenuItem value="Central">🏛️ Central</MenuItem>
              </TextField>
            </Stack>
            <Typography variant="subtitle1" mt={3} sx={{ fontWeight: 'bold', color: 'primary.main' }}>🎨 Moodboard</Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap">
              {moodboardOptions.map((m) => (
                <Chip key={m.key} icon={m.icon} label={m.label} onClick={() => handleChipToggle(m.key, setMoodboard, moodboard)} color={moodboard.includes(m.key) ? m.color : 'default'} sx={{ mb: 1 }} />
              ))}
            </Stack>
            <Typography variant="subtitle1" mt={3} sx={{ fontWeight: 'bold', color: 'primary.main' }}>🎯 Interests</Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap">
              {interestsList.map((i) => (
                <Chip key={i} label={i} onClick={() => handleChipToggle(i, setInterests, interests)} color={interests.includes(i) ? 'primary' : 'default'} sx={{ mb: 1 }} />
              ))}
            </Stack>
            <TextField 
              label="Wishes (comma separated) e.g. foodie, historical, honeymoon" 
              fullWidth 
              margin="normal" 
              value={wishes} 
              onChange={(e) => setWishes(e.target.value)} 
              sx={{ backgroundColor: 'rgba(255, 255, 255, 0.8)' }}
            />
            {mapSrc && (
              <Box mt={2} sx={{ borderRadius: 2, overflow: 'hidden', boxShadow: '0 4px 16px rgba(0,0,0,0.1)' }}>
                <iframe title="map" src={mapSrc} width="100%" height="240" style={{ border: 0 }} loading="lazy" />
              </Box>
            )}
            <Button 
              type="submit" 
              variant="contained" 
              color="primary" 
              fullWidth 
              size="large" 
              sx={{ 
                mt: 3, 
                py: 1.5, 
                fontSize: '1.1rem',
                background: 'linear-gradient(45deg, #1976d2 30%, #ff6d00 90%)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #1565c0 30%, #e65100 90%)',
                }
              }} 
              disabled={loading}
            >
              {loading ? '🔄 Generating...' : '🚀 Generate Itinerary'}
            </Button>
          </form>
        </Box>
      </Box>

      {/* Right Side Scroller */}
      <Box 
        sx={{ 
          position: 'relative', 
          zIndex: 2, 
          width: 320, 
          height: '100vh', 
          overflow: 'hidden',
          display: { xs: 'none', lg: 'block' }
        }}
      >
        <Box 
          sx={{ 
            backgroundColor: 'rgba(255, 255, 255, 0.95)', 
            borderRadius: 3, 
            m: 2, 
            p: 2, 
            boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
            backdropFilter: 'blur(10px)',
            height: 'calc(100vh - 32px)',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          <Typography variant="h6" sx={{ textAlign: 'center', mb: 2, color: 'primary.main', fontWeight: 'bold' }}>
            🌟 Best for {currentMonth}
          </Typography>
          
          <Box sx={{ flex: 1, overflow: 'hidden', position: 'relative' }}>
            <Box 
              sx={{ 
                transform: `translateY(-${scrollPosition * 280}px)`,
                transition: 'transform 0.3s ease-in-out'
              }}
            >
              {currentDestinations.map((destination, index) => (
                <Card 
                  key={index}
                  sx={{ 
                    mb: 2, 
                    cursor: 'pointer',
                    transition: 'all 0.2s ease-in-out',
                    '&:hover': {
                      transform: 'scale(1.02)',
                      boxShadow: '0 4px 20px rgba(0,0,0,0.15)'
                    }
                  }}
                  onClick={() => selectDestination(destination)}
                >
                  <CardMedia
                    component="img"
                    height="140"
                    image={getDestinationImage(destination)}
                    alt={destination.name}
                    sx={{
                      objectFit: 'cover',
                      '&:hover': {
                        transform: 'scale(1.05)',
                        transition: 'transform 0.3s ease-in-out'
                      }
                    }}
                  />
                  <CardContent sx={{ p: 2 }}>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                      {destination.name}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'primary.main', mb: 1, fontWeight: 'bold' }}>
                      {destination.vibe}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.8rem' }}>
                      {destination.description}
                    </Typography>
                  </CardContent>
                </Card>
              ))}
            </Box>
          </Box>

          {/* Scroll Controls */}
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mt: 2 }}>
            <IconButton 
              onClick={scrollUp} 
              disabled={scrollPosition === 0}
              sx={{ 
                backgroundColor: 'rgba(25, 118, 210, 0.1)',
                '&:hover': { backgroundColor: 'rgba(25, 118, 210, 0.2)' }
              }}
            >
              <KeyboardArrowUpIcon />
            </IconButton>
            <IconButton 
              onClick={scrollDown} 
              disabled={scrollPosition >= currentDestinations.length - 1}
              sx={{ 
                backgroundColor: 'rgba(25, 118, 210, 0.1)',
                '&:hover': { backgroundColor: 'rgba(25, 118, 210, 0.2)' }
              }}
            >
              <KeyboardArrowDownIcon />
            </IconButton>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default Planner;
