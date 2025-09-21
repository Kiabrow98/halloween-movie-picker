// Load environment variables from .env file
require('dotenv').config();
const express = require('express');
const cors = require('cors');

// Create Express app
const app = express();

// Middleware
app.use(cors()); // Allow requests from frontend
app.use(express.json()); // Parse JSON data
app.use(express.static('public')); // Serve frontend files

// Get API key from environment variable
const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE = 'https://api.themoviedb.org/3';

// API Routes (these replace direct TMDB calls)

// Get movie details by ID
app.get('/api/movie/:id', async (req, res) => {
    try {
        const { id } = req.params;
        console.log(`Fetching movie ID: ${id}`);
        
        const response = await fetch(`${TMDB_BASE}/movie/${id}?api_key=${TMDB_API_KEY}&language=en-US`);
        
        if (!response.ok) {
            return res.status(404).json({ error: 'Movie not found' });
        }
        
        const movie = await response.json();
        res.json(movie);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Discover movies by genre
app.get('/api/discover', async (req, res) => {
    try {
        const { genres, page = 1, vote_count = 50 } = req.query;
        console.log(`Discovering movies: genres=${genres}, page=${page}`);
        
        const url = `${TMDB_BASE}/discover/movie?api_key=${TMDB_API_KEY}&with_genres=${genres}&language=en-US&sort_by=popularity.desc&vote_count.gte=${vote_count}&page=${page}`;
        
        const response = await fetch(url);
        
        if (!response.ok) {
            return res.status(400).json({ error: 'Failed to fetch movies' });
        }
        
        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Get streaming providers
app.get('/api/movie/:id/providers', async (req, res) => {
    try {
        const { id } = req.params;
        console.log(`Fetching providers for movie ID: ${id}`);
        
        const response = await fetch(`${TMDB_BASE}/movie/${id}/watch/providers?api_key=${TMDB_API_KEY}`);
        
        if (!response.ok) {
            return res.status(404).json({ error: 'Providers not found' });
        }
        
        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🎃 Halloween Movie Picker server running on port ${PORT}`);
    console.log(`Visit: http://localhost:${PORT}`);
});


