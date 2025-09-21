window.onload = function() {
  alert(
    "👻 Welcome to the Halloween Movie Picker! 🎃\n\n" +
    "Here's how to use the site:\n" +
    "1. Choose a genre or\n" +
    "2. Let the Scare Selector choose for you.\n" +
    "3. Enjoy your spooky movie night!\n\n" +
    "More movies and features will be added over time. Happy Halloween! 🦇"
  );
};

async function getMovieDetails(movieId) {
    try {
        console.log(`Fetching movie details for ID: ${movieId}`);
        const response = await fetch(`/api/movie/${movieId}`);
        
        if (!response.ok) {
            console.error(`API response not OK: ${response.status}`);
            return null;
        }
        
        const movie = await response.json();
        console.log(`Movie fetched:`, movie.title, movie.id);
        return movie;
    } catch (error) {
        console.error(`Error fetching movie details for ID ${movieId}:`, error);
        return null;
    }
}

async function getMoviesByGenreAPI(genreType) {
    try {
        const genreIds = tmdbGenres[genreType];
        const genreParam = Array.isArray(genreIds) ? genreIds.join(',') : genreIds;
        
        console.log(`Searching API for genre: ${genreType}, genre IDs: ${genreParam}`);
        
        const response = await fetch(`/api/discover?genres=${genreParam}&page=1&vote_count=50`);
        
        if (!response.ok) {
            console.error('API request failed');
            return null;
        }
        
        const data = await response.json();
        let movies = data.results || [];
        
        console.log(`Found ${movies.length} movies from API`);
        
        if (movies.length > 0) {
            const keywords = genreKeywords[genreType] || [];
            const filteredMovies = movies.filter(movie => {
                const searchText = `${movie.title} ${movie.overview}`.toLowerCase();
                return keywords.some(keyword => searchText.includes(keyword.toLowerCase()));
            });
            
            const finalMovies = filteredMovies.length > 0 ? filteredMovies.slice(0, 5) : movies.slice(0, 5);
            const selectedMovie = finalMovies[Math.floor(Math.random() * finalMovies.length)];
            console.log(`Selected API movie:`, selectedMovie.title);
            return selectedMovie;
        }
        
        return null;
    } catch (error) {
        console.error(`Error fetching ${genreType} movies from API:`, error);
        return null;
    }
}

async function getStreamingAvailability(movieId) {
    try {
        console.log(`Fetching streaming info for movie ID: ${movieId}`);
        
        const response = await fetch(`/api/movie/${movieId}/providers`);
        
        if (!response.ok) {
            console.log('Streaming info not available');
            return null;
        }
        
        const data = await response.json();
        const usProviders = data.results?.US;
        
        if (!usProviders) {
            console.log('No US streaming providers found');
            return null;
        }
        
        console.log('Streaming providers found:', usProviders);
        return usProviders;
        
    } catch (error) {
        console.error('Error fetching streaming availability:', error);
        return null;
    }
}

async function getRandomHorrorMovie() {
    try {
        console.log('Scare Selector: Fetching random horror movie...');
        
        const randomPage = Math.floor(Math.random() * 10) + 1;
        const response = await fetch(`/api/discover?genres=27&page=${randomPage}&vote_count=100`);
        
        if (!response.ok) {
            console.error('API request failed');
            return null;
        }
        
        const data = await response.json();
        const movies = data.results || [];
        
        console.log(`Found ${movies.length} horror movies from page ${randomPage}`);
        
        if (movies.length > 0) {
            const randomMovie = movies[Math.floor(Math.random() * movies.length)];
            console.log('Selected random horror movie:', randomMovie.title);
            return randomMovie;
        }
        
        return null;
    } catch (error) {
        console.error('Error fetching random horror movie:', error);
        return null;
    }
}

// Custom movie arrays with VERIFIED TMDB IDs
const customMovies = {
    slasher: [
        { id: 948, title: "Halloween", year: 1978 },
        { id: 377, title: "A Nightmare on Elm Street", year: 1984 },
        { id: 4232, title: "Scream", year: 1996 },
        { id: 176, title: "Saw", year: 2004 },
        { id: 86328, title: "Terrifier", year: 2011 },
        { id: 9529, title: "Candyman", year: 1992 },
        { id: 4488, title: "Friday the 13th", year: 1980 },
        { id: 4233, title: "Scream 2", year: 1997 },
        { id: 440021, title: "Happy Death Day", year: 2017 }
    ],
    demonic: [
        { id: 9552, title: "The Exorcist", year: 1973 },
        { id: 138843, title: "The Conjuring", year: 2013 },
        { id: 419704, title: "Hereditary", year: 2018 },
        { id: 49018, title: "Insidious", year: 2011 },
        { id: 259693, title: "The Conjuring 2", year: 2016 },
        { id: 82507, title: "Sinister", year: 2012 },
        { id: 439079, title: "The Nun", year: 2018 }
    ],
    paranormal: [
        { id: 745, title: "The Sixth Sense", year: 1999 },
        { id: 565, title: "The Ring", year: 2002 },
        { id: 609, title: "Poltergeist", year: 1982 },
        { id: 694, title: "The Shining", year: 1980 },
        { id: 23827, title: "Paranormal Activity", year: 2007 },
        { id: 8913, title: "Pet Sematary", year: 1989 }
    ],
    monster: [
        { id: 348, title: "Alien", year: 1979 },
        { id: 1091, title: "The Thing", year: 1982 },
        { id: 346364, title: "IT", year: 2017 },
        { id: 242224, title: "The Babadook", year: 2014 },
        { id: 5876, title: "The Mist", year: 2007 }
    ],
    zombie: [
        { id: 170, title: "28 Days Later", year: 2002 },
        { id: 396535, title: "Train to Busan", year: 2016 },
        { id: 924, title: "Dawn of the Dead", year: 2004 },
        { id: 19908, title: "Zombieland", year: 2009 },
        { id: 72190, title: "World War Z", year: 2013 }
    ],
    gore: [
        { id: 176, title: "Saw", year: 2004 },
        { id: 1690, title: "Hostel", year: 2006 },
        { id: 9373, title: "The Texas Chainsaw Massacre", year: 2003 },
        { id: 663712, title: "Terrifier 2", year: 2022 },
        { id: 19994, title: "Jennifer's Body", year: 2009 }
    ],
    kids: [
        { id: 14836, title: "Coraline", year: 2009 },
        { id: 9479, title: "The Nightmare Before Christmas", year: 1993 },
        { id: 10439, title: "Hocus Pocus", year: 1993 },
        { id: 4011, title: "Beetlejuice", year: 1988 },
        { id: 9297, title: "Monster House", year: 2006 },
        { id: 927, title: "Gremlins", year: 1984 }
    ],
    vampire: [
        { id: 628, title: "Interview with the Vampire", year: 1994 },
        { id: 1547, title: "The Lost Boys", year: 1987 },
        { id: 36647, title: "Blade", year: 1998 },
        { id: 4513, title: "30 Days of Night", year: 2007 },
        { id: 277, title: "Underworld", year: 2003 }
    ],
    psychological: [
        { id: 274, title: "The Silence of the Lambs", year: 1991 },
        { id: 807, title: "Se7en", year: 1995 },
        { id: 1359, title: "American Psycho", year: 2000 },
        { id: 419430, title: "Get Out", year: 2017 },
        { id: 381288, title: "Split", year: 2016 },
        { id: 530385, title: "Midsommar", year: 2019 }
    ],
    comedy: [
        { id: 747, title: "Shaun of the Dead", year: 2004 },
        { id: 620, title: "Ghostbusters", year: 1984 },
        { id: 4247, title: "Scary Movie", year: 2000 },
        { id: 4248, title: "Scary Movie 2", year: 2001 }
    ]
};

// TMDB Genre IDs for API searches
const tmdbGenres = {
    slasher: 27,
    demonic: 27,
    paranormal: 27,
    monster: 27,
    zombie: 27,
    gore: 27,
    kids: [27, 10751],
    vampire: 27,
    psychological: [27, 53],
    comedy: [27, 35]
};

// Keywords for better API filtering
const genreKeywords = {
    slasher: ['slasher', 'killer', 'murder', 'stalk'],
    demonic: ['demon', 'possession', 'evil', 'supernatural'],
    paranormal: ['ghost', 'haunted', 'spirit', 'supernatural'],
    monster: ['monster', 'creature', 'alien', 'beast'],
    zombie: ['zombie', 'undead', 'apocalypse'],
    gore: ['blood', 'torture', 'brutal', 'violent'],
    kids: ['family', 'children', 'adventure'],
    vampire: ['vampire', 'blood', 'bite'],
    psychological: ['psychological', 'mind', 'thriller'],
    comedy: ['comedy', 'funny', 'humor']
};

// Main function - heavily favor custom movies to avoid API issues
async function getMovieByGenre(genreType) {
    // 90% chance to use custom array, 10% chance for API
    const useCustom = Math.random() < 0.9;
    
    if (useCustom && customMovies[genreType] && customMovies[genreType].length > 0) {
        const customMovieList = customMovies[genreType];
        const randomCustom = customMovieList[Math.floor(Math.random() * customMovieList.length)];
        
        console.log(`Trying custom movie:`, randomCustom.title, `ID: ${randomCustom.id}`);
        
        const movieDetails = await getMovieDetails(randomCustom.id);
        if (movieDetails) {
            return { movie: movieDetails, source: 'custom' };
        } else {
            console.log(`Custom movie failed, trying another one...`);
            // Try a different custom movie if the first fails
            const anotherCustom = customMovieList[Math.floor(Math.random() * customMovieList.length)];
            const anotherMovieDetails = await getMovieDetails(anotherCustom.id);
            if (anotherMovieDetails) {
                return { movie: anotherMovieDetails, source: 'custom' };
            }
        }
    }
    
    // Fallback to API only if custom completely fails
    console.log(`Falling back to API for genre: ${genreType}`);
    const apiMovie = await getMoviesByGenreAPI(genreType);
    if (apiMovie) {
        return { movie: apiMovie, source: 'api' };
    }
    
    return null;
}

// Generic function that all onclick handlers use
async function pickMovieByGenre(genreType) {
    try {
        document.getElementById('movieDisplay').innerHTML = `<p>Finding a great ${genreType} movie for you...</p>`;
        
        const result = await getMovieByGenre(genreType);
        if (result) {
            displayMovieWithStreaming(result.movie, genreType, result.source);
        } else {
            document.getElementById('movieDisplay').innerHTML = `<p>No ${genreType} movie found. Please try again!</p>`;
        }
    } catch (error) {
        console.error(`Error picking ${genreType} movie:`, error);
        document.getElementById('movieDisplay').innerHTML = `<p>Error loading ${genreType} movie. Please try again!</p>`;
    }
}

// Function to format streaming providers into HTML
function formatStreamingProviders(providers) {
    if (!providers) {
        return '<p><strong>Streaming:</strong> Not available on major streaming platforms</p>';
    }
    
    let streamingHTML = '<p><strong>Where to Watch:</strong><br>';
    
    // Streaming services (subscription)
    if (providers.flatrate && providers.flatrate.length > 0) {
        streamingHTML += '<strong>Stream:</strong> ';
        const streamingServices = providers.flatrate.map(provider => provider.provider_name).join(', ');
        streamingHTML += streamingServices + '<br>';
    }
    
    // Rent/Buy services
    if (providers.rent && providers.rent.length > 0) {
        streamingHTML += '<strong>Rent:</strong> ';
        const rentServices = providers.rent.map(provider => provider.provider_name).join(', ');
        streamingHTML += rentServices + '<br>';
    }
    
    // Buy services
    if (providers.buy && providers.buy.length > 0) {
        streamingHTML += '<strong>Buy:</strong> ';
        const buyServices = providers.buy.map(provider => provider.provider_name).join(', ');
        streamingHTML += buyServices + '<br>';
    }
    
    // If no streaming options found
    if (!providers.flatrate && !providers.rent && !providers.buy) {
        streamingHTML += 'Not available on major streaming platforms<br>';
    }
    
    streamingHTML += '</p>';
    return streamingHTML;
}

// Enhanced displayMovie function with streaming info
async function displayMovieWithStreaming(movie, genreType, source = 'custom') {
    const movieDisplay = document.getElementById('movieDisplay');
    const sourceText = source === 'custom' ? 'Curated Pick' : 
                      source === 'scare-selector' ? 'Scare Selector' : 'API Discovery';
    
    // Show basic movie info first
    movieDisplay.innerHTML = `
        <h2>${movie.title || movie.original_title}</h2>
        <img class="movieDisplayImage" src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title} Poster" onerror="this.src='https://via.placeholder.com/500x750?text=No+Image'">
        <p><strong>Genre:</strong> ${genreType.charAt(0).toUpperCase() + genreType.slice(1)} Horror</p>
        <p><strong>Source:</strong> ${sourceText}</p>
        <p><strong>Rating:</strong> ${movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'}/10</p>
        <p><strong>Release Date:</strong> ${movie.release_date || movie.year}</p>
        <p><strong>Movie ID:</strong> ${movie.id} (for debugging)</p>
        <p><strong>Streaming:</strong> Loading...</p>
        <p><strong>Overview:</strong><br>${movie.overview || 'A classic horror movie in the ' + genreType + ' genre.'}</p>`;
    
    // Get and add streaming info
    const streamingInfo = await getStreamingAvailability(movie.id);
    const streamingHTML = formatStreamingProviders(streamingInfo);
    
    // Update the display with streaming info
    movieDisplay.innerHTML = `
        <h2>${movie.title || movie.original_title}</h2>
        <img class="movieDisplayImage" src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title} Poster" onerror="this.src='https://via.placeholder.com/500x750?text=No+Image'">
        <p><strong>Genre:</strong> ${genreType.charAt(0).toUpperCase() + genreType.slice(1)} Horror</p>
        <p><strong>Source:</strong> ${sourceText}</p>
        <p><strong>Rating:</strong> ${movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'}/10</p>
        <p><strong>Release Date:</strong> ${movie.release_date || movie.year}</p>
        <p><strong>Movie ID:</strong> ${movie.id} (for debugging)</p>
        ${streamingHTML}
        <p><strong>Overview:</strong><br>${movie.overview || 'A classic horror movie in the ' + genreType + ' genre.'}</p>`;
}

// Individual functions for each genre
async function pickSlasherMovie() {
    await pickMovieByGenre('slasher');
}

async function pickDemonicMovie() {
    await pickMovieByGenre('demonic');
}

async function pickParanormalMovie() {
    await pickMovieByGenre('paranormal');
}

async function pickMonsterMovie() {
    await pickMovieByGenre('monster');
}

async function pickZombieMovie() {
    await pickMovieByGenre('zombie');
}

async function pickGoreMovie() {
    await pickMovieByGenre('gore');
}

async function pickKidsMovie() {
    await pickMovieByGenre('kids');
}

async function pickVampireMovie() {
    await pickMovieByGenre('vampire');
}

async function pickPsychologicalMovie() {
    await pickMovieByGenre('psychological');
}

async function pickComedyMovie() {
    await pickMovieByGenre('comedy');
}

// Function for the scare selector button
async function scareSelector() {
    try {
        document.getElementById('movieDisplay').innerHTML = `<p>🎬 Selecting a scary movie for you...</p>`;
        
        const movie = await getRandomHorrorMovie();
        if (movie) {
            // Use your existing displayMovie function but with 'horror' as genre type
            displayMovieWithStreaming(movie, 'horror', 'scare-selector');
        } else {
            document.getElementById('movieDisplay').innerHTML = `<p>No horror movie found. Please try again!</p>`;
        }
    } catch (error) {
        console.error('Error with scare selector:', error);
        document.getElementById('movieDisplay').innerHTML = `<p>Error loading horror movie. Please try again!</p>`;
    }
}