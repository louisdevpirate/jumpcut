import FilmCard from "@/components/FilmCard";
import { getMovieDetails } from "@/lib/tmdb";
import fs from 'fs';
import path from 'path';

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

export default async function FilmsPage() {
  const films = await getFilms();
  
  // Enrichir les films avec les données TMDb
  const enrichedFilms = await Promise.all(
    films.map(async (film) => {
      const tmdbData = await getMovieDetails(film.tmdbId);
      return {
        ...film,
        poster: tmdbData?.poster_path ? `https://image.tmdb.org/t/p/w500${tmdbData.poster_path}` : '/placeholder-poster.jpg'
      };
    })
  );

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-6xl mx-auto px-6">
        {/* En-tête */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-neutral-900 mb-4">
            Mes films
          </h1>
          <p className="text-neutral-600">
            {films.length} film{films.length > 1 ? 's' : ''} dans votre collection
          </p>
        </div>

        {/* Statistiques rapides */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-4 rounded-lg shadow-sm border border-neutral-200">
            <div className="text-2xl font-bold text-blue-500">{films.length}</div>
            <div className="text-sm text-neutral-600">Total</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-neutral-200">
            <div className="text-2xl font-bold text-green-500">
              {(films.reduce((acc, film) => acc + film.myRating, 0) / films.length).toFixed(1)}
            </div>
            <div className="text-sm text-neutral-600">Note moyenne</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-neutral-200">
            <div className="text-2xl font-bold text-purple-500">
              {Math.max(...films.map(f => f.year))}
            </div>
            <div className="text-sm text-neutral-600">Plus récent</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-neutral-200">
            <div className="text-2xl font-bold text-orange-500">
              {Math.min(...films.map(f => f.year))}
            </div>
            <div className="text-sm text-neutral-600">Plus ancien</div>
          </div>
        </div>

        {/* Liste des films */}
        {enrichedFilms.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {enrichedFilms.map((film) => (
              <FilmCard
                key={film.id}
                id={film.id}
                title={film.title}
                year={film.year}
                poster={film.poster}
                rating={film.myRating}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🎬</div>
            <h3 className="text-xl font-semibold text-neutral-900 mb-2">
              Aucun film dans votre collection
            </h3>
            <p className="text-neutral-600 mb-6">
              Commencez par ajouter votre premier film !
            </p>
            <button className="px-6 py-3 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 transition">
              Ajouter un film
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
