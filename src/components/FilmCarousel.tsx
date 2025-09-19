'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaPlay, FaPlus, FaInfoCircle } from 'react-icons/fa';

interface FilmCarouselProps {
  movies: Array<{
    id: number;
    title: string;
    poster_path: string;
    release_date: string;
    vote_average: number;
  }>;
}

export default function FilmCarousel({ movies }: FilmCarouselProps) {
  const [hoveredMovie, setHoveredMovie] = useState<number | null>(null);

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

  return (
    <div className="carousel-container">
      <div className="carousel-content">
        {movies.map((movie) => (
          <div
            key={movie.id}
            className="relative group cursor-pointer"
            onMouseEnter={() => setHoveredMovie(movie.id)}
            onMouseLeave={() => setHoveredMovie(null)}
          >
            {/* Carte du film */}
            <div className="film-card w-48 h-72 relative">
              <Image
                src={movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : '/placeholder-poster.svg'}
                alt={movie.title}
                fill
                className="object-cover"
              />
              
              {/* Overlay au hover */}
              {hoveredMovie === movie.id && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="flex gap-2">
                    <button className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition">
                      <FaPlay className="text-white text-sm" />
                    </button>
                    <button className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition">
                      <FaPlus className="text-white text-sm" />
                    </button>
                    <Link href={`/films/${movie.id}`}>
                      <button className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition">
                        <FaInfoCircle className="text-white text-sm" />
                      </button>
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Informations du film */}
            <div className="mt-2 px-1">
              <h3 className="text-white text-sm font-medium truncate">
                {movie.title}
              </h3>
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <span>{new Date(movie.release_date).getFullYear()}</span>
                <span>•</span>
                <span>⭐ {movie.vote_average.toFixed(1)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
