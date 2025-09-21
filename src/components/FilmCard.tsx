'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaStar, FaPlus, FaHeart, FaEdit } from 'react-icons/fa';
import Rating, { Rating5 } from './Rating';
import WishlistButton from './WishlistButton';
import { useQuickReview } from '@/hooks/useFilms';
import QuickReview from './QuickReview';
import FilmCorrection from './FilmCorrection';

interface FilmCardProps {
  movie: {
    id: number;
    title: string;
    release_date: string;
    poster_path: string;
    vote_average: number;
    overview?: string;
  };
  variant?: 'default' | 'carousel' | 'list';
  showQuickReview?: boolean;
  userRating?: Rating5;
  userReview?: string;
  isWatched?: boolean;
}

export default function FilmCard({
  movie,
  variant = 'default',
  showQuickReview = true,
  userRating,
  userReview,
  isWatched = false
}: FilmCardProps) {
  const { isOpen, currentMovie, openQuickReview, closeQuickReview } = useQuickReview();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCorrection, setShowCorrection] = useState(false);

  const handleQuickReview = () => {
    openQuickReview({
      tmdbId: movie.id,
      title: movie.title,
      year: new Date(movie.release_date).getFullYear(),
      posterUrl: movie.poster_path
    });
  };

  const handleSubmitReview = async (data: { rating: Rating5; review: string; tmdbId: number }) => {
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/my/films', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          title: movie.title,
          year: new Date(movie.release_date).getFullYear(),
          posterUrl: movie.poster_path
        }),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la sauvegarde');
      }

      closeQuickReview();
      // Optionnel: recharger la page ou mettre à jour l'état parent
      window.location.reload();
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCorrection = () => {
    setShowCorrection(true);
  };

  const handleSaveCorrection = async (correctedFilm: any) => {
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/my/films/correct', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(correctedFilm),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la correction');
      }

      setShowCorrection(false);
      // Recharger la page pour voir les changements
      window.location.reload();
    } catch (error) {
      console.error('Erreur lors de la correction:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const cardClasses = {
    default: 'bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 group',
    carousel: 'bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 group',
    list: 'bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 group'
  };

  const imageClasses = {
    default: 'relative aspect-[2/3]',
    carousel: 'relative aspect-[2/3]',
    list: 'relative w-20 h-28 flex-shrink-0'
  };

  const contentClasses = {
    default: 'p-4',
    carousel: 'p-3',
    list: 'p-4 flex-1'
  };

  if (variant === 'list') {
    return (
      <>
        <div className={cardClasses[variant]}>
          <div className="flex gap-4">
            <div className={imageClasses[variant]}>
              <Image
                src={movie.poster_path ? `https://image.tmdb.org/t/p/w200${movie.poster_path}` : '/placeholder-poster.svg'}
                alt={movie.title}
                fill
                className="object-cover"
                loading="lazy"
              />
              {isWatched && (
                <span className="absolute top-1 left-1 bg-green-500 text-white text-xs px-1.5 py-0.5 rounded font-medium">
                  ✅ Vu
                </span>
              )}
            </div>
            
            <div className={contentClasses[variant]}>
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 truncate mb-1">{movie.title}</h3>
                  <p className="text-sm text-gray-500 mb-2">
                    {movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A'}
                  </p>
                </div>
                
                <div className="flex items-center gap-2 ml-4">
                  {showQuickReview && (
                    <button
                      onClick={handleQuickReview}
                      className="p-2 text-blue-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Critiquer rapidement"
                    >
                      <FaStar className="w-4 h-4" />
                    </button>
                  )}
                  
                  <WishlistButton
                    movieId={movie.id}
                    movieTitle={movie.title}
                    variant="minimal"
                    size="sm"
                  />
                </div>
              </div>

              {/* Note utilisateur si disponible */}
              {userRating && userRating > 0 && (
                <div className="mb-2">
                  <Rating
                    rating={userRating}
                    interactive={false}
                    size="sm"
                    showValue={true}
                  />
                </div>
              )}

              {/* Critique utilisateur si disponible */}
              {userReview && (
                <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                  "{userReview}"
                </p>
              )}

              {/* Note TMDb */}
              <div className="flex items-center gap-1 text-xs text-gray-400">
                <FaStar className="text-yellow-400" />
                <span>{movie.vote_average?.toFixed(1)}/10</span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal de critique rapide */}
        {isOpen && currentMovie && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999] p-4">
            <QuickReview
              movieTitle={currentMovie.title}
              movieId={currentMovie.tmdbId}
              onSubmit={handleSubmitReview}
              onCancel={closeQuickReview}
            />
          </div>
        )}
      </>
    );
  }

  return (
    <>
      <div className={cardClasses[variant]}>
        <div className={imageClasses[variant]}>
          <Image
            src={movie.poster_path ? `https://image.tmdb.org/t/p/w300${movie.poster_path}` : '/placeholder-poster.svg'}
            alt={movie.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
          {isWatched && (
            <span className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded font-medium">
              ✅ Vu
            </span>
          )}
          
          {/* Overlay avec actions */}
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2">
            {showQuickReview && (
              <button
                onClick={handleQuickReview}
                className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                title="Critiquer rapidement"
              >
                <FaStar className="w-4 h-4" />
              </button>
            )}
            
            <WishlistButton
              movieId={movie.id}
              movieTitle={movie.title}
              variant="carousel"
            />
            
            <button
              onClick={handleCorrection}
              className="p-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
              title="Corriger les informations"
            >
              <FaEdit className="w-4 h-4" />
            </button>
            
            <Link href={`/movie/${movie.id}`}>
              <button className="p-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
                <FaPlus className="w-4 h-4" />
              </button>
            </Link>
          </div>
        </div>
        
        <div className={contentClasses[variant]}>
          <h3 className="font-semibold text-sm truncate mb-1 text-gray-900">{movie.title}</h3>
          <p className="text-xs text-gray-500 mb-2">
            {movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A'}
          </p>
          
          {/* Note utilisateur si disponible */}
          {userRating && userRating > 0 && (
            <div className="mb-2">
              <Rating
                rating={userRating}
                interactive={false}
                size="sm"
                showValue={true}
              />
            </div>
          )}

          {/* Critique utilisateur si disponible */}
          {userReview && (
            <p className="text-xs text-gray-600 line-clamp-2 mb-2">
              "{userReview}"
            </p>
          )}

          {/* Note TMDb */}
          <div className="flex items-center gap-1 text-xs text-gray-400">
            <FaStar className="text-yellow-400" />
            <span>{movie.vote_average?.toFixed(1)}/10</span>
          </div>
        </div>
      </div>

      {/* Modal de critique rapide */}
      {isOpen && currentMovie && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999] p-4">
          <QuickReview
            movieTitle={currentMovie.title}
            movieId={currentMovie.tmdbId}
            onSubmit={handleSubmitReview}
            onCancel={closeQuickReview}
          />
        </div>
      )}

      {/* Modal de correction */}
      {showCorrection && (
        <FilmCorrection
          film={{
            tmdbId: movie.id,
            title: movie.title,
            year: new Date(movie.release_date).getFullYear(),
            posterUrl: movie.poster_path,
            rating5: userRating,
            quickReview140: userReview,
            dateWatched: new Date().toISOString()
          }}
          onSave={handleSaveCorrection}
          onCancel={() => setShowCorrection(false)}
        />
      )}
    </>
  );
}