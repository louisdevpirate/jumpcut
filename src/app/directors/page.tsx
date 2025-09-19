import ProgressBar from "@/components/ProgressBar";
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

// Extraire les réalisateurs uniques des films vus
async function getUniqueDirectorsFromFilms() {
  const films = await getFilms();
  const directorsMap = new Map();
  
  for (const film of films) {
    try {
      const tmdbData = await getMovieDetails(film.tmdbId);
      if (tmdbData?.credits?.crew) {
        const director = tmdbData.credits.crew.find(person => person.job === 'Director');
        if (director && !directorsMap.has(director.id)) {
          directorsMap.set(director.id, {
            id: director.id,
            name: director.name,
            profile_path: director.profile_path,
            films: []
          });
        }
        if (director) {
          directorsMap.get(director.id).films.push({
            id: film.id,
            title: film.title,
            year: film.year,
            watched: true
          });
        }
      }
    } catch (error) {
      console.error(`Erreur lors de la récupération du réalisateur pour ${film.title}:`, error);
    }
  }
  
  return Array.from(directorsMap.values());
}

export default async function DirectorsPage() {
  const directors = await getUniqueDirectorsFromFilms();

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-6xl mx-auto px-6">
        {/* En-tête */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-neutral-900 mb-4">
            Réalisateurs
          </h1>
          <p className="text-neutral-600">
            Découvrez les œuvres de vos réalisateurs préférés
          </p>
        </div>

        {/* Liste des réalisateurs */}
        {directors.length > 0 ? (
          <div className="space-y-8">
            {directors.map((director) => {
              const watchedFilms = director.films.filter(f => f.watched).length;
              const totalFilms = director.films.length;

              return (
                <div key={director.id} className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6 animate-fade-in">
                  <div className="flex flex-col md:flex-row gap-6">
                    {/* Photo du réalisateur */}
                    <div className="flex-shrink-0">
                      <div className="relative w-32 h-48 rounded-lg overflow-hidden">
                        <img
                          src={director.profile_path ? `https://image.tmdb.org/t/p/w185${director.profile_path}` : '/placeholder-director.jpg'}
                          alt={director.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>

                    {/* Informations */}
                    <div className="flex-1">
                      <h2 className="text-2xl font-bold text-neutral-900 mb-2">
                        {director.name}
                      </h2>

                      {/* Barre de progression */}
                      <div className="mb-6">
                        <ProgressBar value={watchedFilms} total={totalFilms} />
                      </div>

                      {/* Films */}
                      <div>
                        <h3 className="text-lg font-semibold text-neutral-900 mb-3">
                          Films vus ({totalFilms} films)
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                          {director.films.map((film) => (
                            <div
                              key={film.id}
                              className="bg-green-50 border border-green-200 p-3 rounded-lg"
                            >
                              <div className="font-medium text-neutral-900">
                                {film.title}
                              </div>
                              <div className="text-sm text-neutral-600">
                                {film.year}
                              </div>
                              <div className="text-xs text-green-600 font-medium mt-1">
                                ✓ Vu
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🎬</div>
            <h3 className="text-xl font-semibold text-neutral-900 mb-2">
              Aucun réalisateur trouvé
            </h3>
            <p className="text-neutral-600 mb-6">
              Ajoutez des films à votre collection pour voir les réalisateurs apparaître ici.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
