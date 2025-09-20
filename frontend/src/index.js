import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './styles.css';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';

const theme = createTheme({
  palette: {
    primary: { main: '#1976d2' },
    secondary: { main: '#ff6d00' },
    background: { default: '#f5f6fa' }
  },
  shape: { borderRadius: 10 },
});

const container = document.getElementById('root');
const root = createRoot(container);
root.render(
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <App />
  </ThemeProvider>
); 