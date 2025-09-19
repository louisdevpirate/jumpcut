'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaPlay, FaPlus, FaInfoCircle } from 'react-icons/fa';

interface HeroSectionProps {
  movie: {
    id: number;
    title: string;
    overview: string;
    backdrop_path: string;
    release_date: string;
    vote_average: number;
  };
}

export default function HeroSection({ movie }: HeroSectionProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  if (!movie) return null;

  return (
    <div className="relative h-[70vh] overflow-hidden">
      {/* Image de fond */}
      <div className="absolute inset-0">
        <Image
          src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
          alt={movie.title}
          fill
          className="object-cover"
          priority
        />
        {/* Overlay dégradé */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
      </div>

      {/* Contenu */}
      <div className="relative z-10 h-full flex items-center">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-2xl">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-4 leading-tight">
              {movie.title}
            </h1>
            
            <p className="text-lg md:text-xl text-gray-200 mb-6 leading-relaxed">
              {movie.overview}
            </p>

            <div className="flex items-center gap-4 mb-8">
              <span className="text-sm text-gray-300">
                {new Date(movie.release_date).getFullYear()}
              </span>
              <span className="text-sm text-gray-300">
                ⭐ {movie.vote_average.toFixed(1)}/10
              </span>
            </div>

            {/* Boutons d'action */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="flex items-center gap-2 px-8 py-3 bg-white text-black font-semibold rounded-md hover:bg-gray-200 transition"
              >
                <FaPlay className="text-sm" />
                {isPlaying ? 'Pause' : 'Lecture'}
              </button>
              
              <button className="flex items-center gap-2 px-6 py-3 bg-gray-600/80 text-white font-semibold rounded-md hover:bg-gray-600 transition">
                <FaPlus className="text-sm" />
                Ma Liste
              </button>
              
              <button className="flex items-center gap-2 px-6 py-3 bg-gray-600/80 text-white font-semibold rounded-md hover:bg-gray-600 transition">
                <FaInfoCircle className="text-sm" />
                Plus d'infos
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
