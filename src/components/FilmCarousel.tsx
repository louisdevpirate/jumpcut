'use client';

import { useState, useRef, useEffect } from 'react';
import FilmCard from './FilmCard';

interface FilmCarouselProps {
  movies: Array<{
    id: number;
    title: string;
    poster_path: string;
    release_date: string;
    vote_average: number;
    overview?: string;
  }>;
}

export default function FilmCarousel({ movies }: FilmCarouselProps) {
  const [visibleMovies, setVisibleMovies] = useState(8); // Afficher seulement 8 films initialement
  const carouselRef = useRef<HTMLDivElement>(null);

  // Observer pour le lazy loading
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && visibleMovies < movies.length) {
            // Charger plus de films quand le carrousel devient visible
            setTimeout(() => {
              setVisibleMovies(prev => Math.min(prev + 4, movies.length));
            }, 100);
          }
        });
      },
      { threshold: 0.1 }
    );

    if (carouselRef.current) {
      observer.observe(carouselRef.current);
    }

    return () => observer.disconnect();
  }, [movies.length, visibleMovies]);

  if (!movies || movies.length === 0) {
    return (
      <div className="carousel-container">
        <div className="carousel-content">
          <div className="text-gray-400 text-center py-8">
            Aucun film disponible
          </div>
        </div>
      </div>
    );
  }

  const moviesToShow = movies.slice(0, visibleMovies);

  return (
    <div className="carousel-container" ref={carouselRef}>
      <div className="carousel-content">
        {moviesToShow.map((movie) => (
          <FilmCard
            key={movie.id}
            movie={movie}
            variant="carousel"
            showQuickReview={true}
          />
        ))}
        
        {/* Indicateur de chargement pour plus de films */}
        {visibleMovies < movies.length && (
          <div className="flex items-center justify-center w-48 h-72">
            <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
      </div>
    </div>
  );
}
