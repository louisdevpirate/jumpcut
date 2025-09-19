// Utilitaires pour l'API TMDb
import { TMDB_CONFIG } from '@/config/tmdb';

// Cache simple pour éviter les appels API répétés
const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

function getCachedData(key: string) {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }
  return null;
}

function setCachedData(key: string, data: any) {
  cache.set(key, { data, timestamp: Date.now() });
}

const TMDB_API_KEY = TMDB_CONFIG.API_KEY;
const TMDB_BASE_URL = TMDB_CONFIG.BASE_URL;

export interface TmdbMovie {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  release_date: string;
  vote_average: number;
  genres: Array<{ id: number; name: string }>;
  credits?: {
    cast: Array<{
      id: number;
      name: string;
      character: string;
      profile_path: string;
    }>;
    crew: Array<{
      id: number;
      name: string;
      job: string;
      profile_path: string;
    }>;
  };
}

export interface TmdbTrendingMovie {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  release_date: string;
  vote_average: number;
}

// Fonction pour récupérer les détails d'un film
export async function getMovieDetails(tmdbId: number): Promise<TmdbMovie | null> {
  try {
    const response = await fetch(
      `${TMDB_BASE_URL}/movie/${tmdbId}?api_key=${TMDB_API_KEY}&language=fr-FR&append_to_response=credits`
    );
    
    if (!response.ok) {
      throw new Error(`Erreur API TMDb: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Erreur lors de la récupération des détails du film:', error);
    return null;
  }
}

// Fonction pour récupérer les films tendance
export async function getTrendingMovies(): Promise<TmdbTrendingMovie[]> {
  const cacheKey = 'trending-movies';
  const cachedData = getCachedData(cacheKey);
  if (cachedData) return cachedData;

  try {
    const response = await fetch(
      `${TMDB_BASE_URL}/trending/movie/week?api_key=${TMDB_API_KEY}&language=fr-FR`,
      { next: { revalidate: 300 } } // Cache Next.js pendant 5 minutes
    );
    
    if (!response.ok) {
      throw new Error(`Erreur API TMDb: ${response.status}`);
    }
    
    const data = await response.json();
    const results = data.results;
    
    // Récupérer les détails complets du premier film pour le Hero
    if (results.length > 0) {
      const firstMovieDetails = await getMovieDetails(results[0].id);
      if (firstMovieDetails) {
        results[0] = {
          ...results[0],
          overview: firstMovieDetails.overview,
          backdrop_path: firstMovieDetails.backdrop_path
        };
      }
    }
    
    setCachedData(cacheKey, results);
    return results;
  } catch (error) {
    console.error('Erreur lors de la récupération des films tendance:', error);
    return [];
  }
}

// Fonction pour récupérer les films populaires
export async function getPopularMovies(): Promise<TmdbTrendingMovie[]> {
  const cacheKey = 'popular-movies';
  const cachedData = getCachedData(cacheKey);
  if (cachedData) return cachedData;

  try {
    const response = await fetch(
      `${TMDB_BASE_URL}/movie/popular?api_key=${TMDB_API_KEY}&language=fr-FR&page=1`,
      { next: { revalidate: 300 } }
    );
    
    if (!response.ok) {
      throw new Error(`Erreur API TMDb: ${response.status}`);
    }
    
    const data = await response.json();
    const results = data.results;
    setCachedData(cacheKey, results);
    return results;
  } catch (error) {
    console.error('Erreur lors de la récupération des films populaires:', error);
    return [];
  }
}

// Fonction pour récupérer les films actuellement en salles
export async function getNowPlayingMovies(): Promise<TmdbTrendingMovie[]> {
  try {
    const response = await fetch(
      `${TMDB_BASE_URL}/movie/now_playing?api_key=${TMDB_API_KEY}&language=fr-FR&page=1`
    );
    
    if (!response.ok) {
      throw new Error(`Erreur API TMDb: ${response.status}`);
    }
    
    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error('Erreur lors de la récupération des films en salles:', error);
    return [];
  }
}

// Fonction pour récupérer les films à venir
export async function getUpcomingMovies(): Promise<TmdbTrendingMovie[]> {
  try {
    const response = await fetch(
      `${TMDB_BASE_URL}/movie/upcoming?api_key=${TMDB_API_KEY}&language=fr-FR&page=1`
    );
    
    if (!response.ok) {
      throw new Error(`Erreur API TMDb: ${response.status}`);
    }
    
    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error('Erreur lors de la récupération des films à venir:', error);
    return [];
  }
}

// Fonction pour récupérer les films par genre
export async function getMoviesByGenre(genreId: number): Promise<TmdbTrendingMovie[]> {
  try {
    const response = await fetch(
      `${TMDB_BASE_URL}/discover/movie?api_key=${TMDB_API_KEY}&language=fr-FR&with_genres=${genreId}&page=1`
    );
    
    if (!response.ok) {
      throw new Error(`Erreur API TMDb: ${response.status}`);
    }
    
    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error(`Erreur lors de la récupération des films du genre ${genreId}:`, error);
    return [];
  }
}

// Fonction pour rechercher un film
export async function searchMovies(query: string): Promise<TmdbMovie[]> {
  try {
    const response = await fetch(
      `${TMDB_BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&language=fr-FR&query=${encodeURIComponent(query)}`
    );
    
    if (!response.ok) {
      throw new Error(`Erreur API TMDb: ${response.status}`);
    }
    
    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error('Erreur lors de la recherche de films:', error);
    return [];
  }
}

// Fonction pour récupérer les informations d'un acteur
export async function getActorDetails(actorId: number) {
  try {
    const response = await fetch(
      `${TMDB_BASE_URL}/person/${actorId}?api_key=${TMDB_API_KEY}&language=fr-FR&append_to_response=movie_credits`
    );
    
    if (!response.ok) {
      throw new Error(`Erreur API TMDb: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Erreur lors de la récupération des détails de l\'acteur:', error);
    return null;
  }
}

// Fonction pour récupérer les informations d'un réalisateur
export async function getDirectorDetails(directorId: number) {
  try {
    const response = await fetch(
      `${TMDB_BASE_URL}/person/${directorId}?api_key=${TMDB_API_KEY}&language=fr-FR&append_to_response=movie_credits`
    );
    
    if (!response.ok) {
      throw new Error(`Erreur API TMDb: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Erreur lors de la récupération des détails du réalisateur:', error);
    return null;
  }
}
