window.onload = function() {
  alert(
    "👻 Welcome to the Halloween Movie Picker! 🎃\n\n" +
    "Here's how to use the site:\n" +
    "1. Choose a genre or\n" +
    "2. Let the Scare Selector choose for you.\n" +
    "3. Enjoy your spooky movie night!\n\n" +
    "More movies and features will be added over time. Happy Halloween! 🦇"
  );
  alert(
        "Disclaimer & Release Notes: Movie data is sourced from The Movie Database (TMDb) API. All movie titles, images, and descriptions are the property of their respective owners. This site is for educational and entertainment purposes only. \n" +
        " \n"+
        "Thanks for using the Halloween Movie Picker! I'm actively adding movies and new features, and you may sometimes encounter incorrect listings (a movie showing the wrong title or thumbnail). \n" +
        "I apologize for any confusion — please use the feedback button on the 'About Me' page to tell me what went wrong (include the genre, the wrong listing, and what you expected). That helps me fix it faster. \n" +
        " \n"+
        "Versioning: Because I'll be continuously deploying new features and movie lists, I'll share/post a new site link after each major update so you can access the most up-to-date version. \n" +
        "Follow the link and check the latest build. \n" +
        "Thanks for reporting bugs and helping improve the app!"
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


// Custom movie arrays with VERIFIED TMDB IDs
const customMovies = {
    slasher: [
        { id: 948, title: "Halloween", year: 1978 },          // VERIFIED
        { id: 377, title: "A Nightmare on Elm Street", year: 1984 }, // VERIFIED
        { id: 4232, title: "Scream", year: 1996 },           // Need to verify
        { id: 176, title: "Saw", year: 2004 },              // Need to verify
        { id: 86328, title: "Terrifier", year: 2011 },
        { id: 13885, title: "Sweeney Todd: The Demon Barber of Fleet Street", year: 2007 },
        { id: 9529, title: "Candyman", year: 1992 },
        { id: 565028, title: "Candyman", year: 2021 },
        { id: 1234, title: "Child's Play", year: 1988 },
        { id: 10320, title: "Child's Play 2", year: 1990 },
        { id: 10321, title: "Child's Play 3", year: 1991 },
        { id: 11932, title: "Bride of Chucky", year: 1998 },
        { id: 11249, title: "Seed of Chucky", year: 2004 },
        { id: 167032, title: "Curse of Chucky", year: 2013 },
        { id: 393345, title: "Cult of Chucky", year: 2017 },
        { id: 424139, title: "Child's Play", year: 2019 },
        { id: 53133, title: "Halloween (2018)", year: 2018 },
        { id: 2082,  title: "Halloween (2007)", year: 2007 },
        { id: 24150, title: "Halloween II", year: 2009 },
        { id: 11281, title: "Halloween II", year: 1981 },
        { id: 10676, title: "Halloween III: Season of the Witch", year: 1982 },
        { id: 11357, title: "Halloween 4: The Return of Michael Myers", year: 1988 },
        { id: 11361, title: "Halloween 5: The Revenge of Michael Myers", year: 1989 },
        { id: 10987, title: "Halloween: The Curse of Michael Myers", year: 1995 },
        { id: 11675, title: "Halloween H20: 20 Years Later", year: 1998 },
        { id: 11442, title: "Halloween: Resurrection", year: 2002 },
        { id: 4233, title: "Scream 2", year: 1997 },
        { id: 4234, title: "Scream 3", year: 2000 },
        { id: 41446, title: "Scream 4", year: 2011 },
        { id: 440021, title: "Happy Death Day", year: 2017 },
        { id: 512196, title: "Happy Death Day 2U", year: 2019 },
        { id: 23437, title: "A Nightmare on Elm Street", year: 2010 },
        { id: 4488, title: "Friday the 13th", year: 1980 },
        { id: 13207, title: "Friday the 13th", year: 2009 },
        { id: 9725, title: "Friday the 13th Part 2", year: 1981 },
        { id: 9728, title: "Friday the 13th Part III", year: 1982 },
        { id: 9730, title: "Friday the 13th: The Final Chapter", year: 1984 },
        { id: 9731, title: "Friday the 13th: A New Beginning", year: 1985 },
        { id: 10225, title: "Friday the 13th Part VI: Jason Lives", year: 1986 },
        { id: 10281, title: "Friday the 13th Part VII: The New Blood", year: 1988 },
        { id: 6466, title: "Freddy vs. Jason", year: 2003 },
        { id: 536554, title: "M3gan", year: 2022},
        { id: 1071585, title: "M3gan 2.0", year: 2025}
    ],
    vintage: [
        { id: 138, title: "Dracula", year: 1931 },
        { id: 13666, title: "The Wolf Man", year: 1941 },
        { id: 10331, title: "Night of the Living Dead", year: 1968 },
        { id: 3035, title: "Frankenstein", year: 1931 },
        { id: 15849, title: "The Mummy", year: 1932 }, 
        { id: 3017, title: "Dr. Jekyll and Mr. Hyde", year: 1920 },
        { id: 539, title: "Psycho", year: 1960 },
        { id: 11772, title: "The Haunting", year: 1963 },
        { id: 805, title: "Rosemary's Baby", year: 1968 },
        { id: 18573, title: "House of Wax", year: 1953 },
        { id: 571, title: "The Birds", year: 1963 },
        { id: 42196, title: "The Bad Seed", year: 1956 },
        { id: 964, title: "The Phantom of the Opera", year: 1925 },
        { id: 3079, title: "The Curse of Frankenstein", year: 1957 },
        { id: 30346, title: "The Body Snathcer", year: 1945 },
        { id: 28501, title: "The Pit and the Pendulum", year: 1961 },
        { id: 28752, title: "The Curse of the Werewolf", year: 1961 },
        { id: 45714, title: "Night of the Eagle", year: 1962 },
        { id: 3112, title: "The Night of the Hunter", year: 1955 },
        { id: 229, title: "Bride of Frankenstein", year: 1935 },
        { id: 28503, title: "Dementia 13", year: 1963 },
        { id: 10242, title: "What Ever Happened to Baby Jane", year: 1962 },
        { id: 11549, title: "Invasion of the Body Snatcher", year: 1956 },
        { id: 11773, title: "Village of the Damned", year: 1960 },
        { id: 3127, title: "The Revenge of Frankenstein", year: 1958 },
    ],  
    paranormal: [
        { id: 745, title: "The Sixth Sense", year: 1999 },   // Need to verify
        { id: 565, title: "The Ring", year: 2002 },          // Need to verify
        { id: 1085, title: "Poltergeist", year: 1982 },       // Need to verify
        { id: 9913, title: "The Skeleton Key", year: 2005 },
        { id: 694, title: "The Shining", year: 1980 },
        { id: 609, title: "Poltergeist", year: 1982 },
        { id: 745, title: "The Sixth Sense", year: 1999 },
        { id: 23827, title: "Paranormal Activity", year: 2007 },
        { id: 41436, title: "Paranormal Activity 2", year: 2010 },
        { id: 41437, title: "Paranormal Activity 3", year: 2011 },
        { id: 82990, title: "Paranormal Activity 4", year: 2012 },
        { id: 146301, title: "Paranormal Activity: The Ghost Dimension", year: 2015},
        { id: 227348, title: "Paranormal Activity: The Marked Ones", year: 2014},
        { id: 11449, title: "The Amityville Horror", year: 1979 },
        { id: 10065, title: "The Amityville Horror", year: 2005 },
        { id: 8913, title: "Pet Sematary", year: 1989 },
        { id: 157433, title: "Pet Sematary", year: 2019 },
        { id: 9030, title: "The Eye", year: 2008 },
        { id: 1008042, title: "Talk to Me", year: 2023 },
        { id: 1078605, title: "Weapons", year: 2025 },
        { id: 1151031, title: "Bring Her Back", year: 2025 },
        { id: 1124620, title: "The Monkey", year: 2024 },
        { id: 1197137, title: "Black Phone 2", year: 2025 },
        { id: 480414, title: "The Curse of La Llorona", year: 2019 },
        { id: 82507, title: "Sinister", year: 2012 },
        { id: 1226578, title: "Longlegs", year: 2024 },
        { id: 9552, title: "The Exorcist", year: 1973 },      // Need to verify
        { id: 138843, title: "The Conjuring", year: 2013 },  // Need to verify
        { id: 419704, title: "Hereditary", year: 2018 },      // Need to verify
        { id: 8643, title: "The Exorcism of Emily Rose", year: 2005 }, 
        { id: 48171, title: "The Rite", year: 2011 },
        { id: 1038392, title: "The Conjuring: Last Rites", year: 2025 },
        { id: 38358, title: "The Last Exorcism", year: 2010 },
        { id: 146203, title: "The Last Exorcism Part II", year: 2013 },
        { id: 77883, title: "The Possession", year: 2012 },
        { id: 49018, title: "Insidious", year: 2011 },
        { id: 91586, title: "Insidious: Chapter 2", year: 2013 },
        { id: 406563, title: "Insidious: The Last Key", year: 2018 },
        { id: 614479, title: "Insidious: The Red Door", year: 2023 },
        { id: 259693, title: "The Conjuring 2", year: 2016 },
        { id: 423108, title: "The Conjuring: The Devil Made Me Do It", year: 2021 },
        { id: 250546, title: "Annabelle", year: 2014 },
        { id: 396422, title: "Annabelle: Creation", year: 2017 },
        { id: 521029, title: "Annabelle Comes Home", year: 2019 },
        { id: 150202, title: "The Haunting in Connecticut", year: 2009 },
        { id: 806, title: "The Omen", year: 2006 },
        { id: 242512, title: "Ouija", year: 2014 },
        { id: 335796, title: "Ouija: Origin of Evil", year: 2016 },
        { id: 297608, title: "The Taking of Deborah Logan", year: 2014 },
        { id: 82507, title: "Sinister", year: 2012 },
        { id: 283445, title: "Sinister 2", year: 2015 },
        { id: 280092, title: "Insidious: Chapter 3", year: 2015 },
        { id: 11449, title: "The Amityville Horror", year: 1979 },
        { id: 10065, title: "The Amityville Horror", year: 2005 },
        { id: 1970, title: "The Grudge", year: 2004 },
        { id: 1975, title: "The Grudge 2", year: 2006 },
        { id: 1977, title: "The Grudge 3", year: 2009 },
        { id: 565, title: "The Ring", year: 2002 },
        { id: 9059, title: "Tales from the Crypt: Demon Knight", year: 1995 },
        { id: 627462, title: "Tales from the Crypt: Volume 2", year: 1992 },
        { id: 585282, title: "Tales from the Crypt: Volume 3", year: 1990 },
        { id: 439079, title: "The Nun", year: 2018 },
        { id: 11380, title: "Bones", year: 2001 },
        { id: 109429, title: "Evil Dead", year: 2013 },
    ],
    monster: [
        { id: 348, title: "Alien", year: 1979 },             
        { id: 1091, title: "The Thing", year: 1982 },        
        { id: 106, title: "Predator", year: 1987 },          
        { id: 439015, title: "Slender Man", year: 2018}, 
        { id: 10489, title: "Cujo", year: 1983 },
        { id: 9599, title: "The Blob", year: 1988 },
        { id: 447332, title: "A Quiet Place", year: 2018 },
        { id: 346364, title: "IT", year: 2017 },
        { id: 474350, title: "IT Chapter Two", year: 2019 },
        { id: 9792, title: "The Hills Have Eyes", year: 2006 },
        { id: 242224, title: "The Babadook", year: 2014 },
        { id: 5876, title: "The Mist", year: 2007 },
        { id: 2756, title: "The Abyss", year: 1989 },
        { id: 9902, title: "Wrong Turn", year: 2003 },
        { id: 9360, title: "Anaconda", year: 1997},
        { id: 913290, title: "Barbarian", year: 2022 },
        { id: 439015, title: "Slender Man", year: 2018},
        { id: 762505, title: "Nope", year: 2022 }, // A is for Asia//verify
        { id: 945961, title: "Alien: Romulus", year: 2024 },
        { id: 7191, title: "Cloverfield", year: 2008 },
        { id: 814, title: "An American Werewolf in London", year: 1981 },

    ],
    virus: [
        { id: 170, title: "28 Days Later", year: 2002 },    
        { id: 396535, title: "Train to Busan", year: 2016 },
        { id: 10331, title: "Night of the Living Dead", year: 1968 },
        { id: 924, title: "Dawn of the Dead", year: 2004 },
        { id: 923, title: "Dawn of the Dead", year: 1978 },
        { id: 1100988, title: "28 Years Later", year: 2025 },
        { id: 375366, title: "The Girl with All the Gifts", year: 2016 },
        { id: 72190, title: "World War Z", year: 2013 },
        { id: 19908, title: "Zombieland", year: 2009 },
        { id: 338967, title: "Zombieland: Double Tap", year: 2019 },
        { id: 72190, title: "World War Z", year: 2013 },
        { id: 1118031, title: "Apocalypse Z: The Beginning of the End", year: 2024 },
        { id: 6479, title: "I Am Legend", year: 2007 },
        { id: 460458, title: "Resident Evil: Welcome to Racoon City", year: 2021 },
        { id: 294254, title: "Maze Runner: The Scorch Trails", year: 2015 },
        { id: 39538, title: "Contagion", year: 2011 },
        { id: 157424, title: "Cabin Fever: Patient Zero", year: 2014 },
        { id: 29427, title: "The Crazies", year: 2010 },
        { id: 28739, title: "Cabin Fever 2: Spring Fever", year: 2009 },
        { id: 11547, title: "Cabin Fever", year: 2003 },


        
    ],
    gore: [
        { id: 176, title: "Saw", year: 2004 },             
        { id: 1690, title: "Hostel", year: 2006 },
        { id: 9373, title: "The Texas Chainsaw Massacre", year: 2004 },
        { id: 10781, title: "The Texas Chainsaw Massacre: THer Beginning", year: 2006 },
        { id: 28429, title: "The Texas Chainsaw Massacre: A Family Portrait", year: 1988 },
        { id: 10066, title: "House of Wax", year: 2005 },
        { id: 103620, title: "Maniac", year: 2012 },
        { id: 2251, title: "Ichi the Killer", year: 2001 }, //Unfaithful//verify
        { id: 12491, title: "High Tension", year: 2003 },
        { id: 663712, title: "Terrifier 2", year: 2022 },
        { id: 16921, title: "Autopsy", year: 2008 },
        { id: 604079, title: "The Long Walk", year: 2025 },
        { id: 19994, title: "Jennifer's Body", year: 2009 },
        { id: 109428, title: "Evil Dead", year: 2013 },
        { id: 9003, title: "Hellraiser", year: 1987 },
        { id: 9532, title: "Final Destination", year: 2000 },
        { id: 9358, title: "Final Destination 2", year: 2003 },
        { id: 9286, title: "Final Destination 3", year: 2006 },
        { id: 19912, title: "The Final Destination", year: 2009 },
        { id: 55779, title: "Final Destination 5", year: 2011 },
    ],
    kids: [
        { id: 14836, title: "Coraline", year: 2009 },        // Need to verify
        { id: 9479, title: "The Nightmare Before Christmas", year: 1993 }, // Need to verify
        { id: 21481, title: "Twitches", year: 2005 },
        { id: 46169, title: "Twitches Too", year: 2007 },
        { id: 10439, title: "Hocus Pocus", year: 1993 },
        { id: 642885, title: "Hocus Pocus 2", year: 2022 },
        { id: 8839, title: "Casper", year: 1995 }, 
        { id: 70772, title: "Don't Look Under the Bed", year: 1999 },
        { id: 62214, title: "Frankenweenie", year: 2012 },
        { id: 927, title: "Gremlins", year: 1984 },
        { id: 928, title: "Gremlins 2: The New Batch", year: 1990 },
        { id: 3933, title: "Corpse Bride", year: 2005 },
        { id: 4011, title: "Beetlejuice", year: 1988 },
        { id: 9297, title: "Monster House", year: 2006 },
        { id: 27850, title: "Halloweentown", year: 1998 },
        { id: 34205, title: "Halloweentown II: Kalabar's Revenge", year: 2001 },
        { id: 34560, title: "Halloweentown High", year: 2004 },
        { id: 34204, title: "Return to Halloweentown", year: 2006 },
        { id: 2907, title: "The Addams Family", year: 1991 },
        { id: 2758, title: "Addams Family Values", year: 1993 },
        { id: 24100, title: "The Little Vampire", year: 2000 },
        { id: 10756, title: "The Haunted Mansion", year: 2003 },
        { id: 162, title: "Edward Scissorhands", year: 1990 },
        { id: 671, title: "Harry Potter and the Philosopher's Stone", year: 2001 },
        { id: 672, title: "Harry Potter and the Chamber of Secrets", year: 2002 },
        { id: 673, title: "Harry Potter and the Prisoner of Azkaban", year: 2004 },
        { id: 674, title: "Harry Potter and the Goblet of Fire", year: 2005 },
        { id: 675, title: "Harry Potter and the Order of the Phoenix", year: 2007 },
        { id: 767, title: "Harry Potter and the Half-Blood Prince", year: 2009 },
        { id: 12444, title: "Harry Potter and the Deathly Hallows: Part 1", year: 2010 },
        { id: 12445, title: "Harry Potter and the Deathly Hallows: Part 2", year: 2011 },
        { id: 24100, title: "The Little Vampire", year: 2000 },
        { id: 76212, title: "Under Wraps", year: 1997 },
        { id: 92208, title: "Mom's Got a Date with a Vampire", year: 2000 },
        { id: 26450, title: "Phantom Of the Megaplex", year: 2000 },
        { id: 601, title: "E.T. the Extra-Terrestrial", year: 1982 },
        { id: 354912, title: "COCO", year: 2017 }
    ],
    vampire: [
        { id: 628, title: "Interview with the Vampire", year: 1994 },
        { id: 1547, title: "The Lost Boys", year: 1987 },
        { id: 36647, title: "Blade", year: 1998 },
        { id: 1233413, title: "Sinners", year: 2025},
        { id: 30566, title: "Blacula", year: 1972 },
        { id: 12158, title: "Vampire in Brooklyn", year: 1995 },
        { id: 4513, title: "30 Days of Night", year: 2007 },
        { id: 42941, title: "30 Days of Night: Dark Days", year: 2010 },
        { id: 19901, title: "Daybreakers", year: 2010 },
        { id: 41402, title: "Let Me In", year: 2010 },
        { id: 36586, title: "Brade II", year: 2002 },
        { id: 277, title: "Underworld", year: 2003 },
        { id: 834, title: "Underworld: Evolution", year: 2006 },
        { id: 12437, title: "Underworld: Rise of the Lycans", year: 2009 },
        { id: 52520, title: "Underworld: Awakening", year: 2012 },
        { id: 346672, title: "Underworld: Blood Wars", year: 2016 },
        { id: 214629, title: "Sleepwalker", year: 1984},
        { id: 11979, title: "Queen of the Damned", year: 2002 },

    ],
    psychological: [
        { id: 274, title: "The Silence of the Lambs", year: 1991 },
        { id: 11252, title: "Psycho", year: 1998 },             // Need to verify
        { id: 2291, title: "Jacob's Ladder", year: 1990 },
        { id: 456529, title: "Jacob's Ladder", year: 2019 },
        { id: 807, title: "Se7en", year: 1995 },
        { id: 1359, title: "American Psycho", year: 2000 },
        { id: 44214, title: "Black Swan", year: 2010 },
        { id: 11324, title: "Shutter Island", year: 2010 },
        { id: 4553, title: "The Machinist", year: 2004 },
        { id: 1933, title: "The Others", year: 2001 },
        { id: 419430, title: "Get Out", year: 2017 },
        { id: 381288, title: "Split", year: 2016 },
        { id: 458723, title: "US", year: 2019 },
        { id: 530385, title: "Midsommar", year: 2019 },
        { id: 503919, title: "The Lighthouse", year: 2019 },
        { id: 10972, title: "Session 9", year: 2001 },
        { id: 4552, title: "A Tale of Two Sisters", year : 2003 },
        { id: 1954, title: "The Butterfly Effect", year: 2004 },
        { id: 4970, title: "Gothika", year: 2003 },
        { id: 814800, title: "Goodnight Mommy", year: 2014 },
        { id: 399057, title: "The Kiling of a Sacred Deer", year: 2017 },
        { id: 502416, title: "Ma", year: 2019 },
        { id: 21208, title: "Orphan", year: 2009 },
        { id: 522681, title: "Escape Room", year: 2019 },
        { id: 762505, title: "Nope", year: 2022 },
    ],
    comedy: [
        { id: 747, title: "Shaun of the Dead", year: 2004 },
        { id: 620, title: "Ghostbusters", year: 1984 },       
        { id: 43074, title: "Ghostbusters", year: 2016 },
        { id: 4247, title: "Scary Movie", year: 2000 },
        { id: 4248, title: "Scary Movie 2", year: 2001 },
        { id: 4256, title: "Scary Movie 3", year: 2003 },
        { id: 4257, title: "Scary Movie 4", year: 2006 },
        { id: 4258, title: "Scary Movie 5", year: 2013 },
        { id: 18011, title: "Leprechaun in the Hood", year: 2000 },
        { id: 19288, title: "Leprechaun: Back 2 tha Hood", year: 2003 },
        { id: 19908, title: "Zombieland", year: 2009 },
        { id: 139038, title: "A Haunted House", year: 2013 },
        { id: 184345, title: "A Haunted House 2", year: 2014 },
    ],
    horror: [
        { id: 948, title: "Halloween", year: 1978 },          // VERIFIED
        { id: 377, title: "A Nightmare on Elm Street", year: 1984 }, // VERIFIED
        { id: 4232, title: "Scream", year: 1996 },           // Need to verify
        { id: 176, title: "Saw", year: 2004 },              // Need to verify
        { id: 86328, title: "Terrifier", year: 2011 },
        { id: 13885, title: "Sweeney Todd: The Demon Barber of Fleet Street", year: 2007 },
        { id: 9529, title: "Candyman", year: 1992 },
        { id: 565028, title: "Candyman", year: 2021 },
        { id: 1234, title: "Child's Play", year: 1988 },
        { id: 10320, title: "Child's Play 2", year: 1990 },
        { id: 10321, title: "Child's Play 3", year: 1991 },
        { id: 11932, title: "Bride of Chucky", year: 1998 },
        { id: 11249, title: "Seed of Chucky", year: 2004 },
        { id: 167032, title: "Curse of Chucky", year: 2013 },
        { id: 393345, title: "Cult of Chucky", year: 2017 },
        { id: 424139, title: "Child's Play", year: 2019 },
        { id: 53133, title: "Halloween (2018)", year: 2018 },
        { id: 2082,  title: "Halloween (2007)", year: 2007 },
        { id: 24150, title: "Halloween II", year: 2009 },
        { id: 11281, title: "Halloween II", year: 1981 },
        { id: 10676, title: "Halloween III: Season of the Witch", year: 1982 },
        { id: 11357, title: "Halloween 4: The Return of Michael Myers", year: 1988 },
        { id: 11361, title: "Halloween 5: The Revenge of Michael Myers", year: 1989 },
        { id: 10987, title: "Halloween: The Curse of Michael Myers", year: 1995 },
        { id: 11675, title: "Halloween H20: 20 Years Later", year: 1998 },
        { id: 11442, title: "Halloween: Resurrection", year: 2002 },
        { id: 4233, title: "Scream 2", year: 1997 },
        { id: 4234, title: "Scream 3", year: 2000 },
        { id: 41446, title: "Scream 4", year: 2011 },
        { id: 440021, title: "Happy Death Day", year: 2017 },
        { id: 512196, title: "Happy Death Day 2U", year: 2019 },
        { id: 23437, title: "A Nightmare on Elm Street", year: 2010 },
        { id: 4488, title: "Friday the 13th", year: 1980 },
        { id: 13207, title: "Friday the 13th", year: 2009 },
        { id: 9725, title: "Friday the 13th Part 2", year: 1981 },
        { id: 9728, title: "Friday the 13th Part III", year: 1982 },
        { id: 9730, title: "Friday the 13th: The Final Chapter", year: 1984 },
        { id: 9731, title: "Friday the 13th: A New Beginning", year: 1985 },
        { id: 10225, title: "Friday the 13th Part VI: Jason Lives", year: 1986 },
        { id: 10281, title: "Friday the 13th Part VII: The New Blood", year: 1988 },
        { id: 6466, title: "Freddy vs. Jason", year: 2003 },
        { id: 9552, title: "The Exorcist", year: 1973 },      // Need to verify
        { id: 138843, title: "The Conjuring", year: 2013 },  // Need to verify
        { id: 419704, title: "Hereditary", year: 2018 },      // Need to verify
        { id: 8643, title: "The Exorcism of Emily Rose", year: 2005 }, 
        { id: 48171, title: "The Rite", year: 2011 },
        { id: 1038392, title: "The Conjuring: Last Rites", year: 2025 },
        { id: 38358, title: "The Last Exorcism", year: 2010 },
        { id: 146203, title: "The Last Exorcism Part II", year: 2013 },
        { id: 77883, title: "The Possession", year: 2012 },
        { id: 49018, title: "Insidious", year: 2011 },
        { id: 91586, title: "Insidious: Chapter 2", year: 2013 },
        { id: 406563, title: "Insidious: The Last Key", year: 2018 },
        { id: 614479, title: "Insidious: The Red Door", year: 2023 },
        { id: 259693, title: "The Conjuring 2", year: 2016 },
        { id: 423108, title: "The Conjuring: The Devil Made Me Do It", year: 2021 },
        { id: 250546, title: "Annabelle", year: 2014 },
        { id: 396422, title: "Annabelle: Creation", year: 2017 },
        { id: 521029, title: "Annabelle Comes Home", year: 2019 },
        { id: 150202, title: "The Haunting in Connecticut", year: 2009 },
        { id: 806, title: "The Omen", year: 2006 },
        { id: 242512, title: "Ouija", year: 2014 },
        { id: 335796, title: "Ouija: Origin of Evil", year: 2016 },
        { id: 297608, title: "The Taking of Deborah Logan", year: 2014 },
        { id: 82507, title: "Sinister", year: 2012 },
        { id: 283445, title: "Sinister 2", year: 2015 },
        { id: 280092, title: "Insidious: Chapter 3", year: 2015 },
        { id: 11449, title: "The Amityville Horror", year: 1979 },
        { id: 10065, title: "The Amityville Horror", year: 2005 },
        { id: 1970, title: "The Grudge", year: 2004 },
        { id: 1975, title: "The Grudge 2", year: 2006 },
        { id: 1977, title: "The Grudge 3", year: 2009 },
        { id: 565, title: "The Ring", year: 2002 },
        { id: 9059, title: "Tales from the Crypt: Demon Knight", year: 1995 },
        { id: 627462, title: "Tales from the Crypt: Volume 2", year: 1992 },
        { id: 585282, title: "Tales from the Crypt: Volume 3", year: 1990 },
        { id: 439079, title: "The Nun", year: 2018 },
        { id: 11380, title: "Bones", year: 2001 },
        { id: 745, title: "The Sixth Sense", year: 1999 },   // Need to verify
        { id: 565, title: "The Ring", year: 2002 },          // Need to verify
        { id: 1085, title: "Poltergeist", year: 1982 },       // Need to verify
        { id: 9913, title: "The Skeleton Key", year: 2005 },
        { id: 694, title: "The Shining", year: 1980 },
        { id: 609, title: "Poltergeist", year: 1982 },
        { id: 745, title: "The Sixth Sense", year: 1999 },
        { id: 23827, title: "Paranormal Activity", year: 2007 },
        { id: 41436, title: "Paranormal Activity 2", year: 2010 },
        { id: 41437, title: "Paranormal Activity 3", year: 2011 },
        { id: 82990, title: "Paranormal Activity 4", year: 2012 },
        { id: 146301, title: "Paranormal Activity: The Ghost Dimension", year: 2015},
        { id: 227348, title: "Paranormal Activity: The Marked Ones", year: 2014},
        { id: 11449, title: "The Amityville Horror", year: 1979 },
        { id: 10065, title: "The Amityville Horror", year: 2005 },
        { id: 8913, title: "Pet Sematary", year: 1989 },
        { id: 157433, title: "Pet Sematary", year: 2019 },
        { id: 9030, title: "The Eye", year: 2008 },
        { id: 348, title: "Alien", year: 1979 },             // Need to verify
        { id: 1091, title: "The Thing", year: 1982 },        // Need to verify
        { id: 106, title: "Predator", year: 1987 },          // Need to verify
        { id: 19614, title: "IT", year: 1990}, 
        { id: 346364, title: "IT", year: 2017 },
        { id: 474350, title: "IT Chapter Two", year: 2019 },
        { id: 9792, title: "The Hills Have Eyes", year: 2006 },
        { id: 242224, title: "The Babadook", year: 2014 },
        { id: 5876, title: "The Mist", year: 2007 },
        { id: 2756, title: "The Abyss", year: 1989 },
        { id: 9902, title: "Wrong Turn", year: 2003 },
        { id: 9360, title: "Anaconda", year: 1997},
        { id: 913290, title: "Barbarian", year: 2022 },
        { id: 170, title: "28 Days Later", year: 2002 },    
        { id: 396535, title: "Train to Busan", year: 2016 },
        { id: 10331, title: "Night of the Living Dead", year: 1968 },
        { id: 924, title: "Dawn of the Dead", year: 2004 },
        { id: 923, title: "Dawn of the Dead", year: 1978 },
        { id: 1100988, title: "28 Years Later", year: 2025 },
        { id: 375366, title: "The Girl with All the Gifts", year: 2016 },
        { id: 72190, title: "World War Z", year: 2013 },
        { id: 19908, title: "Zombieland", year: 2009 },
        { id: 338967, title: "Zombieland: Double Tap", year: 2019 },
        { id: 176, title: "Saw", year: 2004 },             
        { id: 1690, title: "Hostel", year: 2006 },
        { id: 9373, title: "The Texas Chainsaw Massacre", year: 2004 },
        { id: 10781, title: "The Texas Chainsaw Massacre: THer Beginning", year: 2006 },
        { id: 28429, title: "The Texas Chainsaw Massacre: A Family Portrait", year: 1988 },
        { id: 10066, title: "House of Wax", year: 2005 },
        { id: 103620, title: "Maniac", year: 2012 },
        { id: 2251, title: "Ichi the Killer", year: 2001 },
        { id: 12491, title: "High Tension", year: 2003 },
        { id: 663712, title: "Terrifier 2", year: 2022 },
        { id: 16921, title: "Autopsy", year: 2008 },
        { id: 604079, title: "The Long Walk", year: 2025 },
        { id: 19994, title: "Jennifer's Body", year: 2009 },
        { id: 14836, title: "Coraline", year: 2009 },        // Need to verify
        { id: 9479, title: "The Nightmare Before Christmas", year: 1993 }, // Need to verify
        { id: 21481, title: "Twitches", year: 2005 },
        { id: 46169, title: "Twitches Too", year: 2007 },
        { id: 10439, title: "Hocus Pocus", year: 1993 },
        { id: 642885, title: "Hocus Pocus 2", year: 2022 },
        { id: 8839, title: "Casper", year: 1995 }, 
        { id: 70772, title: "Don't Look Under the Bed", year: 1999 },
        { id: 62214, title: "Frankenweenie", year: 2012 },
        { id: 927, title: "Gremlins", year: 1984 },
        { id: 928, title: "Gremlins 2: The New Batch", year: 1990 },
        { id: 3933, title: "Corpse Bride", year: 2005 },
        { id: 4011, title: "Beetlejuice", year: 1988 },
        { id: 9297, title: "Monster House", year: 2006 },
        { id: 27850, title: "Halloweentown", year: 1998 },
        { id: 34205, title: "Halloweentown II: Kalabar's Revenge", year: 2001 },
        { id: 34560, title: "Halloweentown High", year: 2004 },
        { id: 34204, title: "Return to Halloweentown", year: 2006 },
        { id: 2907, title: "The Addams Family", year: 1991 },
        { id: 2758, title: "Addams Family Values", year: 1993 },
        { id: 24100, title: "The Little Vampire", year: 2000 },
        { id: 10756, title: "The Haunted Mansion", year: 2003 },
        { id: 162, title: "Edward Scissorhands", year: 1990 },
        { id: 671, title: "Harry Potter and the Philosopher's Stone", year: 2001 },
        { id: 672, title: "Harry Potter and the Chamber of Secrets", year: 2002 },
        { id: 673, title: "Harry Potter and the Prisoner of Azkaban", year: 2004 },
        { id: 674, title: "Harry Potter and the Goblet of Fire", year: 2005 },
        { id: 675, title: "Harry Potter and the Order of the Phoenix", year: 2007 },
        { id: 767, title: "Harry Potter and the Half-Blood Prince", year: 2009 },
        { id: 12444, title: "Harry Potter and the Deathly Hallows: Part 1", year: 2010 },
        { id: 12445, title: "Harry Potter and the Deathly Hallows: Part 2", year: 2011 },
        { id: 628, title: "Interview with the Vampire", year: 1994 },
        { id: 1547, title: "The Lost Boys", year: 1987 },
        { id: 36647, title: "Blade", year: 1998 },
        { id: 1233413, title: "Sinners", year: 2025},
        { id: 30566, title: "Blacula", year: 1972 },
        { id: 12158, title: "Vampire in Brooklyn", year: 1995 },
        { id: 4513, title: "30 Days of Night", year: 2007 },
        { id: 42941, title: "30 Days of Night: Dark Days", year: 2010 },
        { id: 19901, title: "Daybreakers", year: 2010 },
        { id: 41402, title: "Let Me In", year: 2010 },
        { id: 36586, title: "Brade II", year: 2002 },
        { id: 277, title: "Underworld", year: 2003 },
        { id: 834, title: "Underworld: Evolution", year: 2006 },
        { id: 12437, title: "Underworld: Rise of the Lycans", year: 2009 },
        { id: 52520, title: "Underworld: Awakening", year: 2012 },
        { id: 346672, title: "Underworld: Blood Wars", year: 2016 },
        { id: 274, title: "The Silence of the Lambs", year: 1991 },
        { id: 11252, title: "Psycho", year: 1998 },             // Need to verify
        { id: 2291, title: "Jacob's Ladder", year: 1990 },
        { id: 456529, title: "Jacob's Ladder", year: 2019 },
        { id: 807, title: "Se7en", year: 1995 },
        { id: 1359, title: "American Psycho", year: 2000 },
        { id: 44214, title: "Black Swan", year: 2010 },
        { id: 11324, title: "Shutter Island", year: 2010 },
        { id: 4553, title: "The Machinist", year: 2004 },
        { id: 1933, title: "The Others", year: 2001 },
        { id: 419430, title: "Get Out", year: 2017 },
        { id: 381288, title: "Split", year: 2016 },
        { id: 458723, title: "US", year: 2019 },
        { id: 530385, title: "Midsommar", year: 2019 },
        { id: 503919, title: "The Lighthouse", year: 2019 },
        { id: 10972, title: "Session 9", year: 2001 },
        { id: 4552, title: "A Tale of Two Sisters", year : 2003 },
        { id: 1954, title: "The Butterfly Effect", year: 2004 },
        { id: 4970, title: "Gothika", year: 2003 },
        { id: 814800, title: "Goodnight Mommy", year: 2014 },
        { id: 399057, title: "The Kiling of a Sacred Deer", year: 2017 },
        { id: 502416, title: "Ma", year: 2019 },
        { id: 21208, title: "Orphan", year: 2009 },
        { id: 747, title: "Shaun of the Dead", year: 2004 },
        { id: 620, title: "Ghostbusters", year: 1984 },       
        { id: 43074, title: "Ghostbusters", year: 2016 },
        { id: 4247, title: "Scary Movie", year: 2000 },
        { id: 4248, title: "Scary Movie 2", year: 2001 },
        { id: 4256, title: "Scary Movie 3", year: 2003 },
        { id: 4257, title: "Scary Movie 4", year: 2006 },
        { id: 4258, title: "Scary Movie 5", year: 2013 }
    ] 
};

// TMDB Genre IDs for API searches
const tmdbGenres = {
    slasher: 27,
    tvSeries: [27, 10765],
    paranormal: 27,
    monster: 27,
    zombieVirus: 27,
    gore: 27,
    kids: [27, 10751],
    vampire: 27,
    psychological: [27, 53],
    comedy: [27, 35]
};

// Keywords for better API filtering
const genreKeywords = {
    slasher: ['slasher', 'killer', 'murder', 'stalk'],
    vintage: ['vintage', 'murder', 'horror', 'blood'],
    paranormal: ['ghost', 'haunted', 'spirit', 'supernatural'],
    monster: ['monster', 'creature', 'alien', 'beast'],
    virus: ['zombie', 'undead', 'apocalypse'],
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
        <img class="movieDisplayImage" src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title} Poster" onerror="this.onerror=null; this.src='./images/no-image.jpg';">
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

async function pickVintageMovie() {
    await pickMovieByGenre('vintage');
}

async function pickParanormalMovie() {
    await pickMovieByGenre('paranormal');
}

async function pickMonsterMovie() {
    await pickMovieByGenre('monster');
}

async function pickVirusMovie() {
    await pickMovieByGenre('virus');
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
    await pickMovieByGenre('horror');
}


function showAboutMe() {
    // Hide the main content
    document.querySelector('main').style.display = 'none';
    document.querySelector('.flexbox-heading').style.display = 'none';
    document.querySelector('.pick-genre').style.display = 'none';
    
    // Hide any existing back buttons from the main page
    const existingBackButtons = document.querySelectorAll('.back-button');
    existingBackButtons.forEach(btn => btn.style.display = 'none');
    
    // Show about me section
    document.getElementById('aboutMeSection').style.display = 'block';
}

function showHomePage() {
    // Show the main content
    document.querySelector('main').style.display = 'block';
    document.querySelector('.flexbox-heading').style.display = 'block';
    document.querySelector('.pick-genre').style.display = 'block';
    
    // Hide about me section
    document.getElementById('aboutMeSection').style.display = 'none';
    
    // Clear any movie displays that might have back buttons
    document.getElementById('movieDisplay').innerHTML = '';
}
 // Wait for DOM to be fully loaded
        document.addEventListener('DOMContentLoaded', function()
            {
            const WEB3FORMS_KEY = 'ac044ef8-21b8-460a-9925-c67192058b02';

            let currentFeedbackType = 'enjoyed';

            // DOM Elements
            const feedbackButton = document.getElementById('feedback-button');
        const overlay = document.getElementById('feedback-overlay');
        const closeButton = document.getElementById('close-button');
        const submitButton = document.getElementById('submit-button');
        const typeButtons = document.querySelectorAll('.type-button');
        const statusMessage = document.getElementById('status-message');
        const messageInput = document.getElementById('message-input');
        const movieOptional = document.getElementById('movie-optional');
        const submitIcon = document.getElementById('submit-icon');
        const submitText = document.getElementById('submit-text');

        // Open modal
        feedbackButton.addEventListener('click', () => {
            overlay.classList.add('active');
        });

        // Close modal
        closeButton.addEventListener('click', () => {
            overlay.classList.remove('active');
        });

        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                overlay.classList.remove('active');
            }
        });

        // Feedback type selection
        typeButtons.forEach(button => {
            button.addEventListener('click', () => {
                typeButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                currentFeedbackType = button.dataset.type;

                // Update placeholder and movie field label
                if (currentFeedbackType === 'enjoyed') {
                    messageInput.placeholder = 'Tell me what you loved about this movie!';
                    movieOptional.style.display = 'none';
                } else if (currentFeedbackType === 'suggestion') {
                    messageInput.placeholder = 'What movie should I add? Why?';
                    movieOptional.style.display = 'inline';
                } else {
                    messageInput.placeholder = 'What information is incorrect?';
                    movieOptional.style.display = 'none';
                }
            });
        });

        // Submit form
        submitButton.addEventListener('click', async () => {
            const name = document.getElementById('name-input').value;
            const email = document.getElementById('email-input').value;
            const movieTitle = document.getElementById('movie-input').value;
            const message = messageInput.value.trim();

            if (!message) {
                showStatus('error', 'Please enter a message!');
                return;
            }

            // Disable button and show loading
            submitButton.disabled = true;
            submitText.textContent = 'Sending...';
            submitIcon.innerHTML = '<div class="spinner"></div>';
            statusMessage.className = 'status-message';

            try {
                const response = await fetch('https://api.web3forms.com/submit', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify({
                        access_key: WEB3FORMS_KEY,
                        subject: `31 Screams Feedback - ${currentFeedbackType.charAt(0).toUpperCase() + currentFeedbackType.slice(1)}`,
                        from_name: name || 'Anonymous',
                        email: email || 'noreply@31screams.com',
                        feedback_type: currentFeedbackType,
                        movie_title: movieTitle,
                        message: message
                    })
                });

                const data = await response.json();

                if (data.success) {
                    showStatus('success', '✓ Thanks for your feedback! We appreciate it! 🎃');
                    // Clear form
                    document.getElementById('name-input').value = '';
                    document.getElementById('email-input').value = '';
                    document.getElementById('movie-input').value = '';
                    messageInput.value = '';

                    // Close modal after 2 seconds
                    setTimeout(() => {
                        overlay.classList.remove('active');
                        statusMessage.className = 'status-message';
                    }, 2000);
                } else {
                    showStatus('error', '✗ Oops! Something went wrong. Please try again.');
                }
            } catch (error) {
                showStatus('error', '✗ Oops! Something went wrong. Please try again.');
            } finally {
                // Reset button
                submitButton.disabled = false;
                submitText.textContent = 'Send Feedback';
                submitIcon.innerHTML = '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z"/></svg>';
            }
        });

        function showStatus(type, message) {
            statusMessage.textContent = message;
            statusMessage.className = `status-message ${type}`;
        }

            }
        );
