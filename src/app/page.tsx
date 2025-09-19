import { getTrendingMovies, getPopularMovies, getNowPlayingMovies, getUpcomingMovies, getMoviesByGenre } from '@/lib/tmdb';
import FilmCarousel from '@/components/FilmCarousel';
import HeroSection from '@/components/HeroSection';

export default async function FilmsPage() {
  // Récupérer les données de différentes sections
  const [
    trendingMovies,
    popularMovies,
    nowPlayingMovies,
    upcomingMovies,
    actionMovies,
    dramaMovies,
    comedyMovies,
    horrorMovies
  ] = await Promise.all([
    getTrendingMovies(),
    getPopularMovies(),
    getNowPlayingMovies(),
    getUpcomingMovies(),
    getMoviesByGenre(28), // Action
    getMoviesByGenre(18), // Drame
    getMoviesByGenre(35), // Comédie
    getMoviesByGenre(27)  // Horreur
  ]);

  return (
    <div className="min-h-screen bg-black">
      {/* Section Hero avec film en vedette */}
      <HeroSection movie={trendingMovies[0]} />
      
      <div className="relative z-10 -mt-32">
        <div className="max-w-7xl mx-auto px-6 pb-12">
          
          {/* Films populaires */}
          <div className="netflix-section">
            <h2 className="netflix-section-title">Populaires</h2>
            <FilmCarousel movies={popularMovies} />
          </div>

          {/* Actuellement en salles */}
          <div className="netflix-section">
            <h2 className="netflix-section-title">Actuellement en salles</h2>
            <FilmCarousel movies={nowPlayingMovies} />
          </div>

          {/* Tendances */}
          <div className="netflix-section">
            <h2 className="netflix-section-title">Tendances</h2>
            <FilmCarousel movies={trendingMovies} />
          </div>

          {/* À venir */}
          <div className="netflix-section">
            <h2 className="netflix-section-title">À venir</h2>
            <FilmCarousel movies={upcomingMovies} />
          </div>

          {/* Par genre */}
          <div className="netflix-section">
            <h2 className="netflix-section-title">Action</h2>
            <FilmCarousel movies={actionMovies} />
          </div>

          <div className="netflix-section">
            <h2 className="netflix-section-title">Drame</h2>
            <FilmCarousel movies={dramaMovies} />
          </div>

          <div className="netflix-section">
            <h2 className="netflix-section-title">Comédie</h2>
            <FilmCarousel movies={comedyMovies} />
          </div>

          <div className="netflix-section">
            <h2 className="netflix-section-title">Horreur</h2>
            <FilmCarousel movies={horrorMovies} />
          </div>

        </div>
      </div>
    </div>
  );
}