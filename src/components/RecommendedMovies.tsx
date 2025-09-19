'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import WishlistButton from './WishlistButton';
import QuickReviewButton from './QuickReviewButton';
import { FaPlay, FaInfoCircle } from 'react-icons/fa';

interface RecommendedMoviesProps {
  movieId: number;
  onAddToCollection?: (data: { rating: number; review: string }) => Promise<void>;
}

interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  release_date: string;
  vote_average: number;
}

export default function RecommendedMovies({ movieId, onAddToCollection }: RecommendedMoviesProps) {
  const [recommendations, setRecommendations] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function fetchRecommendations() {
      try {
        const response = await fetch(`/api/tmdb/movie/${movieId}/recommendations`);
        if (response.ok) {
          const data = await response.json();
          setRecommendations(data.results?.slice(0, 6) || []);
        } else {
          setError(true);
        }
      } catch (error) {
        console.error('Erreur lors du chargement des recommandations:', error);
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    fetchRecommendations();
  }, [movieId]);

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
        <h3 className="text-xl font-bold text-neutral-900 mb-4 font-satoshi">
          🎬 Films recommandés
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {Array.from({ length: 6 }, (_, i) => (
            <div key={i} className="bg-gray-200 rounded-lg aspect-[2/3] animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error || recommendations.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
      <h3 className="text-xl font-bold text-neutral-900 mb-6 font-satoshi">
        🎬 Films recommandés
      </h3>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {recommendations.map((movie) => (
          <div key={movie.id} className="group">
            <Link href={`/search/${movie.id}`}>
              <div className="bg-gray-50 rounded-lg overflow-hidden hover:bg-gray-100 transition-colors">
                <div className="relative aspect-[2/3]">
                  <Image
                    src={movie.poster_path ? `https://image.tmdb.org/t/p/w300${movie.poster_path}` : '/placeholder-poster.svg'}
                    alt={movie.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                </div>
                <div className="p-3">
                  <h4 className="font-semibold text-sm text-neutral-900 truncate mb-1">
                    {movie.title}
                  </h4>
                  <p className="text-xs text-neutral-500 mb-2">
                    {new Date(movie.release_date).getFullYear()}
                  </p>
                  <div className="flex items-center gap-1 text-xs text-neutral-400">
                    <span>⭐</span>
                    <span>{movie.vote_average.toFixed(1)}/10</span>
                  </div>
                </div>
              </div>
            </Link>
            
            {/* Actions rapides */}
            <div className="mt-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <WishlistButton
                tmdbId={movie.id}
                title={movie.title}
                year={new Date(movie.release_date).getFullYear()}
                poster_path={movie.poster_path}
                overview={movie.overview}
                variant="minimal"
                size="sm"
              />
              {onAddToCollection && (
                <QuickReviewButton
                  movieId={movie.id}
                  movieTitle={movie.title}
                  onReviewSubmit={onAddToCollection}
                  variant="minimal"
                  size="sm"
                />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
