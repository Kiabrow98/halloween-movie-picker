export default async function handler(req, res) {
    const { id } = req.query;
    const TMDB_API_KEY = process.env.TMDB_API_KEY;
    
    try {
        const response = await fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=${TMDB_API_KEY}`);
        const data = await response.json();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}