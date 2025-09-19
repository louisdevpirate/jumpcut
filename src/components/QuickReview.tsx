'use client';

import { useState } from 'react';
import StarRatingModern from './StarRatingModern';

interface QuickReviewProps {
  onSubmit: (data: { rating: number; review: string }) => void;
  onCancel: () => void;
  initialRating?: number;
  initialReview?: string;
  movieTitle?: string;
}

export default function QuickReview({ 
  onSubmit, 
  onCancel, 
  initialRating = 0, 
  initialReview = '',
  movieTitle 
}: QuickReviewProps) {
  const [rating, setRating] = useState(initialRating);
  const [review, setReview] = useState(initialReview);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      alert('Veuillez donner une note au film');
      return;
    }
    
    setIsSubmitting(true);
    try {
      await onSubmit({ rating, review: review.trim() });
    } catch (error) {
      console.error('Erreur lors de la soumission:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const remainingChars = 140 - review.length;
  const isOverLimit = remainingChars < 0;

  return (
    <div className="bg-white rounded-xl shadow-lg border border-neutral-200 p-6 max-w-md mx-auto">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-neutral-900 mb-2">
          {movieTitle ? `Critique rapide - ${movieTitle}` : 'Critique rapide'}
        </h3>
        <p className="text-sm text-neutral-600">
          Partagez votre avis en quelques mots (140 caractères max)
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Note en étoiles */}
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Votre note
          </label>
          <StarRatingModern
            rating={rating}
            onRatingChange={setRating}
            interactive={true}
            size="lg"
            showValue={true}
          />
        </div>

        {/* Critique rapide */}
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Votre avis
          </label>
          <textarea
            value={review}
            onChange={(e) => setReview(e.target.value)}
            placeholder="Ex: Excellent film, scénario captivant, acteurs parfaits..."
            className={`w-full p-3 border rounded-lg resize-none focus:ring-2 focus:ring-blue-500 outline-none ${
              isOverLimit ? 'border-red-300 focus:ring-red-500' : 'border-neutral-300'
            }`}
            rows={3}
            maxLength={140}
          />
          <div className="flex justify-between items-center mt-1">
            <span className={`text-xs ${isOverLimit ? 'text-red-500' : 'text-neutral-500'}`}>
              {remainingChars} caractères restants
            </span>
            {isOverLimit && (
              <span className="text-xs text-red-500 font-medium">
                Limite dépassée !
              </span>
            )}
          </div>
        </div>

        {/* Boutons */}
        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 px-4 py-2 border border-neutral-300 text-neutral-700 rounded-lg hover:bg-neutral-50 transition-colors"
            disabled={isSubmitting}
          >
            Annuler
          </button>
          <button
            type="submit"
            disabled={isSubmitting || rating === 0 || isOverLimit}
            className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Enregistrement...</span>
              </div>
            ) : (
              'Enregistrer'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
