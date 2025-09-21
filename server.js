const express = require('express');
const path = require('path');

const app = express();

app.use(express.static('public'));

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE = 'https://api.themoviedb.org/3';

app.get('/test', (req, res) => {
    res.json({ status: 'working', hasKey: !!TMDB_API_KEY });
});

app.get('/api/movie/:id', async (req, res) => {
    try {
        const response = await fetch(`${TMDB_BASE}/movie/${req.params.id}?api_key=${TMDB_API_KEY}`);
        const data = await response.json();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/discover', async (req, res) => {
    try {
        const { genres, page = 1 } = req.query;
        const response = await fetch(`${TMDB_BASE}/discover/movie?api_key=${TMDB_API_KEY}&with_genres=${genres}&page=${page}`);
        const data = await response.json();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/movie/:id/providers', async (req, res) => {
    try {
        const response = await fetch(`${TMDB_BASE}/movie/${req.params.id}/watch/providers?api_key=${TMDB_API_KEY}`);
        const data = await response.json();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

module.exports = app;