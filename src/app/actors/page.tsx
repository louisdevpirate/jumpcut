import ProgressBar from "@/components/ProgressBar";
import { getActorDetails } from "@/lib/tmdb";
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

// Extraire les acteurs uniques des films vus
async function getUniqueActorsFromFilms() {
  const films = await getFilms();
  const actorsMap = new Map();
  
  for (const film of films) {
    try {
      const tmdbData = await getActorDetails(film.tmdbId);
      if (tmdbData?.credits?.cast) {
        tmdbData.credits.cast.slice(0, 3).forEach(actor => {
          if (!actorsMap.has(actor.id)) {
            actorsMap.set(actor.id, {
              id: actor.id,
              name: actor.name,
              profile_path: actor.profile_path,
              films: []
            });
          }
          actorsMap.get(actor.id).films.push({
            id: film.id,
            title: film.title,
            year: film.year,
            watched: true
          });
        });
      }
    } catch (error) {
      console.error(`Erreur lors de la récupération des acteurs pour ${film.title}:`, error);
    }
  }
  
  return Array.from(actorsMap.values());
}

export default async function ActorsPage() {
  const actors = await getUniqueActorsFromFilms();

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-6xl mx-auto px-6">
        {/* En-tête */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-neutral-900 mb-4">
            Acteurs
          </h1>
          <p className="text-neutral-600">
            Explorez les filmographies de vos acteurs préférés
          </p>
        </div>

        {/* Liste des acteurs */}
        {actors.length > 0 ? (
          <div className="space-y-8">
            {actors.map((actor) => {
              const watchedFilms = actor.films.filter(f => f.watched).length;
              const totalFilms = actor.films.length;

              return (
                <div key={actor.id} className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6 animate-fade-in">
                  <div className="flex flex-col md:flex-row gap-6">
                    {/* Photo de l'acteur */}
                    <div className="flex-shrink-0">
                      <div className="relative w-32 h-48 rounded-lg overflow-hidden">
                        <img
                          src={actor.profile_path ? `https://image.tmdb.org/t/p/w185${actor.profile_path}` : '/placeholder-actor.jpg'}
                          alt={actor.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>

                    {/* Informations */}
                    <div className="flex-1">
                      <h2 className="text-2xl font-bold text-neutral-900 mb-2">
                        {actor.name}
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
                          {actor.films.map((film) => (
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
            <div className="text-6xl mb-4">🎭</div>
            <h3 className="text-xl font-semibold text-neutral-900 mb-2">
              Aucun acteur trouvé
            </h3>
            <p className="text-neutral-600 mb-6">
              Ajoutez des films à votre collection pour voir les acteurs apparaître ici.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
