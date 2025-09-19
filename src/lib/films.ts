// Utilitaires pour la gestion des données des films
import fs from 'fs';
import path from 'path';

export interface Film {
  id: number;
  tmdbId: number | null;
  title: string;
  year: number | null;
  myRating: number;
  positives: string;
  negatives: string;
  myReview: string;
  dateWatched: string;
}

const FILMS_FILE_PATH = path.join(process.cwd(), 'data', 'films.json');

// Charger tous les films
export function loadFilms(): Film[] {
  try {
    const fileContents = fs.readFileSync(FILMS_FILE_PATH, 'utf8');
    return JSON.parse(fileContents);
  } catch (error) {
    console.error('Erreur lors du chargement des films:', error);
    return [];
  }
}

// Sauvegarder tous les films
export function saveFilms(films: Film[]): void {
  try {
    fs.writeFileSync(FILMS_FILE_PATH, JSON.stringify(films, null, 2), 'utf8');
  } catch (error) {
    console.error('Erreur lors de la sauvegarde des films:', error);
  }
}

// Trouver un film par ID
export function findFilmById(id: number): Film | null {
  const films = loadFilms();
  return films.find(film => film.id === id) || null;
}

// Mettre à jour un film
export function updateFilm(updatedFilm: Film): boolean {
  const films = loadFilms();
  const index = films.findIndex(film => film.id === updatedFilm.id);
  
  if (index === -1) {
    return false;
  }
  
  films[index] = updatedFilm;
  saveFilms(films);
  return true;
}

// Ajouter un nouveau film
export function addFilm(film: Omit<Film, 'id'>): Film {
  const films = loadFilms();
  const newId = Math.max(...films.map(f => f.id), 0) + 1;
  
  const newFilm: Film = {
    ...film,
    id: newId
  };
  
  films.push(newFilm);
  saveFilms(films);
  return newFilm;
}

// Supprimer un film
export function deleteFilm(id: number): boolean {
  const films = loadFilms();
  const index = films.findIndex(film => film.id === id);
  
  if (index === -1) {
    return false;
  }
  
  films.splice(index, 1);
  saveFilms(films);
  return true;
}

// Obtenir les statistiques
export function getStatistics() {
  const films = loadFilms();
  const watchedFilms = films.filter(f => f.myRating > 0);
  
  return {
    total: films.length,
    watched: watchedFilms.length,
    averageRating: watchedFilms.length > 0 
      ? (watchedFilms.reduce((sum, f) => sum + f.myRating, 0) / watchedFilms.length).toFixed(1)
      : 0,
    latestYear: Math.max(...films.map(f => f.year || 0)),
    oldestYear: Math.min(...films.filter(f => f.year).map(f => f.year!))
  };
}
