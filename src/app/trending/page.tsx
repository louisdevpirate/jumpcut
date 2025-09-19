import { getTrendingMovies } from '@/lib/tmdb';
import FilmCarousel from '@/components/FilmCarousel';

export default async function TrendingPage() {
  const trendingMovies = await getTrendingMovies();

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-7xl mx-auto px-6 py-12">
        
        {/* En-tête */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">🔥 À la une</h1>
          <p className="text-gray-400">
            Les films les plus populaires en ce moment
          </p>
        </div>

        {/* Section tendances */}
        <div className="netflix-section">
          <h2 className="netflix-section-title">Tendances de la semaine</h2>
          <FilmCarousel movies={trendingMovies} />
        </div>

        {/* Statistiques */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-800 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-white mb-2">Films populaires</h3>
            <p className="text-gray-400">
              Découvrez les films qui font le buzz cette semaine
            </p>
          </div>
          
          <div className="bg-gray-800 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-white mb-2">Tendances mondiales</h3>
            <p className="text-gray-400">
              Basé sur les données de millions d'utilisateurs TMDb
            </p>
          </div>
          
          <div className="bg-gray-800 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-white mb-2">Mise à jour quotidienne</h3>
            <p className="text-gray-400">
              Les tendances sont mises à jour chaque jour
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
