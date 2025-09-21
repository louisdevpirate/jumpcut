"use client";

import { useState } from "react";
import Link from "next/link";
import { FaPlus, FaInfoCircle, FaStar } from "react-icons/fa";
import QuickReview from "./QuickReview";
import WishlistButton from "./WishlistButton";
import { BackdropImage } from "./OptimizedImage";

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
  const [showQuickReview, setShowQuickReview] = useState(false);

  if (!movie) return null;

  return (
    <div className="relative h-[80vh] overflow-hidden pt-38">
      {/* Image de fond */}
      <div className="absolute inset-0">
        <BackdropImage
          src={movie.backdrop_path}
          alt={movie.title}
          priority
          className="object-cover"
        />
        {/* Overlay dégradé */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
      </div>

      {/* Contenu */}
      <div className="relative z-10 h-full flex items-center">
        <div className="max-w-7xl md:pl-28 pl-6">
          <div className="flex items-center gap-4 text-white px-4 py-1 text-sm border rounded-full mb-2 w-fit border-white">
            À la une
          </div>
          <div className="max-w-2xl">
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 leading-tight font-satoshi">
              {movie.title}
            </h1>

            <p className="text-lg md:text-md text-gray-200 mb-6 leading-relaxed">
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
                onClick={() => setShowQuickReview(true)}
                className="flex items-center gap-2 px-6 py-3 bg-yellow-500 text-black font-semibold rounded-md hover:bg-yellow-400 transition"
              >
                <FaStar className="text-sm" />
                Critiquer
              </button>
              
              <WishlistButton movieId={movie.id} movieTitle={movie.title} variant="hero" />
              
              <Link href={`/movie/${movie.id}`}>
                <button className="flex items-center gap-2 px-6 py-3 bg-gray-600/80 text-white font-semibold rounded-md hover:bg-gray-600 transition">
                  <FaInfoCircle className="text-sm" />
                  Plus d'infos
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      {/* Modal de critique rapide - Portail vers le body */}
      {showQuickReview && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999] p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <QuickReview
              onSubmit={async (data) => {
                // Logique pour sauvegarder la critique
                console.log('Critique soumise:', data);
                setShowQuickReview(false);
              }}
              onCancel={() => setShowQuickReview(false)}
              movieTitle={movie.title}
            />
          </div>
        </div>
      )}
    </div>
  );
}

