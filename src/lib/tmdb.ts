// Utilitaires pour l'API TMDb
import { TMDB_CONFIG } from '@/config/tmdb';

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
  poster_path: string;
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
  try {
    const response = await fetch(
      `${TMDB_BASE_URL}/trending/movie/week?api_key=${TMDB_API_KEY}&language=fr-FR`
    );
    
    if (!response.ok) {
      throw new Error(`Erreur API TMDb: ${response.status}`);
    }
    
    const data = await response.json();
    return data.results.slice(0, 5); // Prendre les 5 premiers
  } catch (error) {
    console.error('Erreur lors de la récupération des films tendance:', error);
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
