// Load environment variables from .env file
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

// Create Express app
const app = express();

// Middleware - STATIC FILES MUST COME FIRST
app.use(cors());
app.use(express.json());
app.use(express.static('public')); // This MUST be before other routes

// Get API key from environment variable
const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE = 'https://api.themoviedb.org/3';

// API Routes first
app.get('/api/movie/:id', async (req, res) => {
    // ... your existing API code
});

app.get('/api/discover', async (req, res) => {
    // ... your existing API code  
});

app.get('/api/movie/:id/providers', async (req, res) => {
    // ... your existing API code
});

// Root route LAST - this catches everything else
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🎃 Halloween Movie Picker server running on port ${PORT}`);
    console.log(`Visit: http://localhost:${PORT}`);
});

module.exports = app;
