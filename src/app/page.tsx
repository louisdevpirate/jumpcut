import { Suspense } from 'react';
import { getTrendingMovies, getPopularMovies, getNowPlayingMovies, getUpcomingMovies, getMoviesByGenre } from '@/lib/tmdb';
import FilmCarousel from '@/components/FilmCarousel';
import HeroSection from '@/components/HeroSection';
import LoadingSkeleton from '@/components/LoadingSkeleton';

// Composant pour charger les sections de manière asynchrone
async function MoviesSection({ title, fetchFunction, genreId }: { title: string; fetchFunction: () => Promise<any>; genreId?: number }) {
  const movies = await fetchFunction();
  return (
    <div className="netflix-section">
      <div className="pl-12 mb-4">
        <h2 className="netflix-section-title">{title}</h2>
      </div>
      <FilmCarousel movies={movies} />
    </div>
  );
}

export default async function FilmsPage() {
  // Charger seulement les données critiques en premier
  const trendingMovies = await getTrendingMovies();

  return (
    <div className="min-h-screen bg-black">
      {/* Section Hero avec film en vedette */}
      <HeroSection movie={trendingMovies[0]} />
      
      <div className="relative z-10 pt-10">
        <div className="pb-12 pl-12 overflow-x-hidden">
          
          {/* Films populaires - Chargement prioritaire */}
          <Suspense fallback={<LoadingSkeleton title="Populaires" />}>
            <MoviesSection title="Populaires" fetchFunction={getPopularMovies} />
          </Suspense>

          {/* Actuellement en salles */}
          <Suspense fallback={<LoadingSkeleton title="En salles" />}>
            <MoviesSection title="Actuellement en salles" fetchFunction={getNowPlayingMovies} />
          </Suspense>

          {/* Tendances */}
          <Suspense fallback={<LoadingSkeleton title="Tendances" />}>
            <MoviesSection title="Tendances" fetchFunction={getTrendingMovies} />
          </Suspense>

          {/* À venir */}
          <Suspense fallback={<LoadingSkeleton title="À venir" />}>
            <MoviesSection title="À venir" fetchFunction={getUpcomingMovies} />
          </Suspense>

          {/* Par genre - Chargement différé */}
          <Suspense fallback={<LoadingSkeleton title="Action" />}>
            <MoviesSection title="Action" fetchFunction={() => getMoviesByGenre(28)} />
          </Suspense>

          <Suspense fallback={<LoadingSkeleton title="Drame" />}>
            <MoviesSection title="Drame" fetchFunction={() => getMoviesByGenre(18)} />
          </Suspense>

          <Suspense fallback={<LoadingSkeleton title="Comédie" />}>
            <MoviesSection title="Comédie" fetchFunction={() => getMoviesByGenre(35)} />
          </Suspense>

          <Suspense fallback={<LoadingSkeleton title="Horreur" />}>
            <MoviesSection title="Horreur" fetchFunction={() => getMoviesByGenre(27)} />
          </Suspense>

        </div>
      </div>
    </div>
  );
}