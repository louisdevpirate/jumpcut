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
  params: Promise<{
    id: string;
  }>;
}

// Génération statique des pages pour tous les films
export async function generateStaticParams() {
  try {
    const films = await getFilms();
    
    // Générer les paramètres pour tous les films avec tmdbId
    return films
      .filter(film => film.tmdbId)
      .map(film => ({
        id: film.id.toString(),
      }));
  } catch (error) {
    console.error('Erreur lors de la génération des paramètres statiques:', error);
    return [];
  }
}

// ISR - Revalidation toutes les 24h
export const revalidate = 86400; // 24 heures

// Métadonnées dynamiques pour le SEO
export async function generateMetadata({ params }: FilmPageProps) {
  const { id } = await params;
  const filmId = parseInt(id);
  const film = await getFilm(filmId);
  
  if (!film) {
    return {
      title: 'Film non trouvé',
      description: 'Ce film n\'existe pas dans votre collection.',
    };
  }

  const tmdbData = await getTmdbData(film.tmdbId);

  return {
    title: `${film.title} (${film.year}) - JumpCut`,
    description: tmdbData?.overview || `Film ${film.title} de ${film.year}`,
    openGraph: {
      title: `${film.title} (${film.year})`,
      description: tmdbData?.overview || `Film ${film.title} de ${film.year}`,
      images: tmdbData?.poster_path ? [
        {
          url: `https://image.tmdb.org/t/p/w500${tmdbData.poster_path}`,
          width: 500,
          height: 750,
          alt: film.title,
        }
      ] : [],
    },
  };
}

export default async function FilmPage({ params }: FilmPageProps) {
  const { id } = await params;
  const filmId = parseInt(id);
  
  console.log('🔍 FilmPage - Recherche du film avec ID:', filmId);
  
  const film = await getFilm(filmId);
  
  console.log('📁 Film trouvé:', film ? `${film.title} (ID: ${film.id}, TMDb: ${film.tmdbId})` : 'AUCUN FILM');
  
  if (!film) {
    console.log('❌ Film non trouvé, redirection vers notFound()');
    notFound();
  }

  console.log('🎬 Chargement des données TMDb pour:', film.tmdbId);
  const tmdbData = await getTmdbData(film.tmdbId);
  console.log('📊 Données TMDb chargées:', tmdbData ? 'SUCCÈS' : 'ÉCHEC');

  return (
    <div className="min-h-screen">
      <FilmDetail film={film} tmdbData={tmdbData || undefined} />
    </div>
  );
}
