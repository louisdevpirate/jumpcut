'use client';

import { useState } from 'react';
import Rating, { Rating5 } from './Rating';
import { FaTimes, FaCheck } from 'react-icons/fa';

interface QuickReviewProps {
  movieTitle: string;
  movieId?: number;
  tmdbId?: number;
  initialRating?: Rating5;
  initialReview?: string;
  onSubmit: (data: { rating: Rating5; review: string; tmdbId: number }) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

export default function QuickReview({
  movieTitle,
  movieId,
  tmdbId,
  initialRating = 0,
  initialReview = '',
  onSubmit,
  onCancel,
  loading = false
}: QuickReviewProps) {
  const [rating, setRating] = useState<Rating5>(initialRating);
  const [review, setReview] = useState(initialReview);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const finalTmdbId = tmdbId || movieId || 0;

  const handleSubmit = async () => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    try {
      await onSubmit({
        rating,
        review: review.trim(),
        tmdbId: finalTmdbId
      });
    } catch (error) {
      console.error('Erreur lors de la soumission:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const isReviewValid = review.trim().length <= 140;
  const canSubmit = rating > 0 && isReviewValid && !isSubmitting;

  return (
    <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
      {/* En-tête */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 font-satoshi">
          Critique rapide
        </h3>
        <button
          onClick={onCancel}
          className="text-gray-400 hover:text-gray-600 transition-colors"
          disabled={isSubmitting}
        >
          <FaTimes className="w-4 h-4" />
        </button>
      </div>

      {/* Titre du film */}
      <div className="mb-4">
        <p className="text-sm text-gray-600 mb-1">Film</p>
        <p className="font-medium text-gray-900 truncate">{movieTitle}</p>
      </div>

      {/* Note */}
      <div className="mb-4">
        <p className="text-sm text-gray-600 mb-2">Note (0.5 - 5 étoiles)</p>
        <Rating
          rating={rating}
          onRatingChange={setRating}
          interactive={true}
          size="lg"
          showValue={true}
          className="justify-center"
        />
      </div>

      {/* Critique */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm text-gray-600">Critique (140 caractères max)</p>
          <span className={`text-xs ${review.length > 140 ? 'text-red-500' : 'text-gray-400'}`}>
            {review.length}/140
          </span>
        </div>
        <textarea
          value={review}
          onChange={(e) => setReview(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Votre avis en quelques mots..."
          className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          rows={3}
          maxLength={140}
          disabled={isSubmitting}
        />
        {review.length > 140 && (
          <p className="text-xs text-red-500 mt-1">
            La critique ne peut pas dépasser 140 caractères
          </p>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <button
          onClick={onCancel}
          disabled={isSubmitting}
          className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
        >
          Annuler
        </button>
        <button
          onClick={handleSubmit}
          disabled={!canSubmit}
          className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Sauvegarde...
            </>
          ) : (
            <>
              <FaCheck className="w-4 h-4" />
              Sauvegarder
            </>
          )}
        </button>
      </div>

      {/* Raccourci clavier */}
      <div className="mt-3 text-xs text-gray-500 text-center">
        <kbd className="px-2 py-1 bg-gray-100 rounded text-xs">⌘</kbd> + <kbd className="px-2 py-1 bg-gray-100 rounded text-xs">Entrée</kbd> pour sauvegarder
      </div>
    </div>
  );
}