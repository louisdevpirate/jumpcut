'use client';

import { useState } from 'react';

interface StarRatingProps {
  rating: number;
  onRatingChange?: (rating: number) => void;
  interactive?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export default function StarRating({ 
  rating, 
  onRatingChange, 
  interactive = false, 
  size = 'md' 
}: StarRatingProps) {
  const [hoverRating, setHoverRating] = useState(0);

  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-lg',
    lg: 'text-xl'
  };

  const handleStarClick = (starRating: number) => {
    if (interactive && onRatingChange) {
      onRatingChange(starRating);
    }
  };

  const handleStarHover = (starRating: number) => {
    if (interactive) {
      setHoverRating(starRating);
    }
  };

  const handleMouseLeave = () => {
    if (interactive) {
      setHoverRating(0);
    }
  };

  const displayRating = hoverRating || rating;

  return (
    <div className="flex items-center gap-1">
      <div 
        className={`flex items-center gap-1 ${sizeClasses[size]} ${interactive ? 'cursor-pointer' : ''}`}
        onMouseLeave={handleMouseLeave}
      >
        {Array.from({ length: 5 }, (_, i) => {
          const starRating = i + 1;
          const isFilled = starRating <= displayRating;
          
          return (
            <span
              key={i}
              onClick={() => handleStarClick(starRating)}
              onMouseEnter={() => handleStarHover(starRating)}
              className={`star transition-colors duration-200 ${
                isFilled ? 'text-yellow-400' : 'text-gray-300'
              } ${interactive ? 'hover:text-yellow-300' : ''}`}
            >
              ★
            </span>
          );
        })}
      </div>
      {interactive && (
        <span className="ml-2 text-sm text-neutral-600">
          {rating}/5
        </span>
      )}
    </div>
  );
}
