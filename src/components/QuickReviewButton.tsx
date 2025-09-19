'use client';

import { useState } from 'react';
import { FaComment } from 'react-icons/fa';
import QuickReview from './QuickReview';

interface QuickReviewButtonProps {
  movieId: number;
  movieTitle: string;
  onReviewSubmit: (data: { rating: number; review: string }) => Promise<void>;
  initialRating?: number;
  initialReview?: string;
  variant?: 'primary' | 'secondary' | 'minimal';
  size?: 'sm' | 'md' | 'lg';
}

export default function QuickReviewButton({
  movieId,
  movieTitle,
  onReviewSubmit,
  initialRating = 0,
  initialReview = '',
  variant = 'primary',
  size = 'md'
}: QuickReviewButtonProps) {
  const [showReviewForm, setShowReviewForm] = useState(false);

  const handleReviewSubmit = async (data: { rating: number; review: string }) => {
    try {
      await onReviewSubmit(data);
      setShowReviewForm(false);
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement de la critique:', error);
    }
  };

  const buttonClasses = {
    primary: 'bg-blue-500 text-white hover:bg-blue-600',
    secondary: 'bg-gray-100 text-gray-700 hover:bg-gray-200',
    minimal: 'bg-transparent text-blue-500 hover:bg-blue-50 border border-blue-500'
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  };

  return (
    <>
      <button
        onClick={() => setShowReviewForm(true)}
        className={`flex items-center gap-2 rounded-lg font-medium transition-colors ${buttonClasses[variant]} ${sizeClasses[size]}`}
      >
        <FaComment className="text-sm" />
        <span>+ Critique rapide</span>
      </button>

      {showReviewForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="relative">
            <QuickReview
              onSubmit={handleReviewSubmit}
              onCancel={() => setShowReviewForm(false)}
              initialRating={initialRating}
              initialReview={initialReview}
              movieTitle={movieTitle}
            />
          </div>
        </div>
      )}
    </>
  );
}
