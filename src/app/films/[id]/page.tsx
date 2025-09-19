import FilmDetail from "@/components/FilmDetail";
import { getMovieDetails } from "@/lib/tmdb";
import fs from 'fs';
import path from 'path';
import { notFound } from 'next/navigation';

interface Film {
  id: number;
  tmdbId: number;
  title: string;
  year: number;
  myRating: number;
  positives: string;
  negatives: string;
  myReview: string;
  dateWatched: string;
}

async function getFilms(): Promise<Film[]> {
  const filePath = path.join(process.cwd(), 'data', 'films.json');
  const fileContents = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(fileContents);
}

async function getFilm(id: number): Promise<Film | null> {
  const films = await getFilms();
  return films.find(film => film.id === id) || null;
}

// Simulation des données TMDb (à remplacer par l'API réelle)
async function getTmdbData(tmdbId: number) {
  // Utiliser l'API TMDb réelle
  const movieDetails = await getMovieDetails(tmdbId);
  
  if (!movieDetails) {
    return null;
  }

  // Trouver le réalisateur dans l'équipe
  const director = movieDetails.credits?.crew.find(person => person.job === 'Director');
  
  return {
    poster_path: movieDetails.poster_path,
    overview: movieDetails.overview,
    genres: movieDetails.genres,
    director: director?.name,
    cast: movieDetails.credits?.cast.slice(0, 5) || []
  };
}

interface FilmPageProps {
  params: {
    id: string;
  };
}

export default async function FilmPage({ params }: FilmPageProps) {
  const { id } = await params;
  const filmId = parseInt(id);
  const film = await getFilm(filmId);
  
  if (!film) {
    notFound();
  }

  const tmdbData = await getTmdbData(film.tmdbId);

  return (
    <div className="min-h-screen">
      <FilmDetail film={film} tmdbData={tmdbData} />
    </div>
  );
}
