const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE = 'https://api.themoviedb.org/3';

// Explicit static file routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/script.js', (req, res) => {
    res.setHeader('Content-Type', 'application/javascript');
    res.sendFile(path.join(__dirname, 'public', 'script.js'));
});

app.get('/styles/:filename', (req, res) => {
    res.setHeader('Content-Type', 'text/css');
    res.sendFile(path.join(__dirname, 'public', 'styles', req.params.filename));
});

app.get('/images/:filename', (req, res) => {
    const ext = path.extname(req.params.filename).toLowerCase();
    const mimeTypes = {
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.png': 'image/png',
        '.gif': 'image/gif'
    };
    res.setHeader('Content-Type', mimeTypes[ext] || 'image/jpeg');
    res.sendFile(path.join(__dirname, 'public', 'images', req.params.filename));
});

app.get('/test', (req, res) => {
    res.json({ status: 'working', hasKey: !!TMDB_API_KEY });
});

// API routes
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
        const response = await fetch(`${TMDB_BASE}/movie/${req.params.id}/providers?api_key=${TMDB_API_KEY}`);
        const data = await response.json();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = app;