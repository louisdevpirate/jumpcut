import FilmCard from "@/components/FilmCard";
import { getTrendingMovies } from "@/lib/tmdb";

export default async function Home() {
  // Récupérer les films tendance depuis TMDb
  const trendingMovies = await getTrendingMovies();
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="section-gradient py-16 animate-fade-in">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h1 className="text-5xl font-bold text-neutral-900 mb-4">
            Bienvenue dans votre cinémathèque
          </h1>
          <p className="text-xl text-neutral-600 mb-8 max-w-2xl mx-auto">
            Collectionnez, notez et critiquez vos films préférés. 
            Découvrez de nouveaux films et suivez votre progression cinématographique.
          </p>
          <div className="flex gap-4 justify-center">
            <a
              href="/films"
              className="btn-primary px-6 py-3 text-white font-medium rounded-lg"
            >
              Voir mes films
            </a>
            <a
              href="#trending"
              className="px-6 py-3 border border-neutral-300 text-neutral-700 font-medium rounded-lg hover:bg-white transition"
            >
              Films tendance
            </a>
          </div>
        </div>
      </div>

      {/* Section À la une */}
      <section id="trending" className="py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-neutral-900 mb-4">
              À la une cette semaine
            </h2>
            <p className="text-neutral-600">
              Découvrez les films qui font parler d'eux en ce moment
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {trendingMovies.map((movie) => (
              <FilmCard
                key={movie.id}
                id={movie.id}
                title={movie.title}
                year={new Date(movie.release_date).getFullYear()}
                poster={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                rating={Math.round(movie.vote_average)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Section Statistiques */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-neutral-900 mb-4">
              Mes statistiques
            </h2>
            <p className="text-neutral-600">
              Suivez votre progression cinématographique
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="stat-card text-center p-6 rounded-xl animate-scale-in">
              <div className="text-4xl font-bold text-blue-500 mb-2">5</div>
              <div className="text-neutral-600">Films vus</div>
            </div>
            <div className="stat-card text-center p-6 rounded-xl animate-scale-in" style={{ animationDelay: '0.1s' }}>
              <div className="text-4xl font-bold text-green-500 mb-2">9.2</div>
              <div className="text-neutral-600">Note moyenne</div>
            </div>
            <div className="stat-card text-center p-6 rounded-xl animate-scale-in" style={{ animationDelay: '0.2s' }}>
              <div className="text-4xl font-bold text-purple-500 mb-2">2024</div>
              <div className="text-neutral-600">Année la plus récente</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
