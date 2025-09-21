const express = require('express');
const path = require('path');

const app = express();

// Middleware
app.use(express.json());
app.use(express.static('public'));

// Get API key from environment variable
const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE = 'https://api.themoviedb.org/3';

// Basic health check
app.get('/health', (req, res) => {
    res.json({ status: 'OK', apiKey: !!TMDB_API_KEY });
});

// API Routes
app.get('/api/movie/:id', async (req, res) => {
    try {
        const { id } = req.params;
        
        if (!TMDB_API_KEY) {
            return res.status(500).json({ error: 'API key not configured' });
        }
        
        const response = await fetch(`${TMDB_BASE}/movie/${id}?api_key=${TMDB_API_KEY}&language=en-US`);
        
        if (!response.ok) {
            return res.status(404).json({ error: 'Movie not found' });
        }
        
        const movie = await response.json();
        res.json(movie);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Server error', details: error.message });
    }
});

app.get('/api/discover', async (req, res) => {
    try {
        const { genres, page = 1, vote_count = 50 } = req.query;
        
        if (!TMDB_API_KEY) {
            return res.status(500).json({ error: 'API key not configured' });
        }
        
        const url = `${TMDB_BASE}/discover/movie?api_key=${TMDB_API_KEY}&with_genres=${genres}&language=en-US&sort_by=popularity.desc&vote_count.gte=${vote_count}&page=${page}`;
        
        const response = await fetch(url);
        
        if (!response.ok) {
            return res.status(400).json({ error: 'Failed to fetch movies' });
        }
        
        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Server error', details: error.message });
    }
});

app.get('/api/movie/:id/providers', async (req, res) => {
    try {
        const { id } = req.params;
        
        if (!TMDB_API_KEY) {
            return res.status(500).json({ error: 'API key not configured' });
        }
        
        const response = await fetch(`${TMDB_BASE}/movie/${id}/watch/providers?api_key=${TMDB_API_KEY}`);
        
        if (!response.ok) {
            return res.status(404).json({ error: 'Providers not found' });
        }
        
        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Server error', details: error.message });
    }
});

// Catch-all route - MUST BE LAST
app.get('/*', (req, res) => {
    try {
        res.sendFile(path.join(__dirname, 'public', 'index.html'));
    } catch (error) {
        res.status(500).send('Error serving file');
    }
});

module.exports = app;