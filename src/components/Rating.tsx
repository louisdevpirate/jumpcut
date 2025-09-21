'use client';

import { useState, useEffect } from 'react';
import { FaStar } from 'react-icons/fa';

export type Rating5 = 0 | 0.5 | 1 | 1.5 | 2 | 2.5 | 3 | 3.5 | 4 | 4.5 | 5;

interface RatingProps {
  rating: Rating5;
  onRatingChange?: (rating: Rating5) => void;
  interactive?: boolean;
  size?: 'sm' | 'md' | 'lg';
  showValue?: boolean;
  className?: string;
}

export default function Rating({ 
  rating, 
  onRatingChange, 
  interactive = false, 
  size = 'md',
  showValue = false,
  className = ''
}: RatingProps) {
  const [hoverRating, setHoverRating] = useState<Rating5 | null>(null);
  const [isKeyboardMode, setIsKeyboardMode] = useState(false);

  const sizeClasses = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4', 
    lg: 'w-5 h-5'
  };

  const textSizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  };

  const currentRating = hoverRating !== null ? hoverRating : rating;

  const handleStarClick = (starRating: Rating5) => {
    if (interactive && onRatingChange) {
      onRatingChange(starRating);
    }
  };

  const handleStarHover = (starRating: Rating5) => {
    if (interactive) {
      setHoverRating(starRating);
    }
  };

  const handleMouseLeave = () => {
    if (interactive) {
      setHoverRating(null);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (!interactive || !onRatingChange) return;

    const current = currentRating;
    let newRating: Rating5;

    switch (event.key) {
      case 'ArrowRight':
      case 'ArrowUp':
        event.preventDefault();
        newRating = Math.min(5, current + 0.5) as Rating5;
        onRatingChange(newRating);
        break;
      case 'ArrowLeft':
      case 'ArrowDown':
        event.preventDefault();
        newRating = Math.max(0, current - 0.5) as Rating5;
        onRatingChange(newRating);
        break;
      case 'Enter':
      case ' ':
        event.preventDefault();
        // Toggle entre 0 et 5
        newRating = current === 0 ? 5 : 0;
        onRatingChange(newRating);
        break;
      case 'Tab':
        setIsKeyboardMode(false);
        break;
    }
  };

  const handleFocus = () => {
    setIsKeyboardMode(true);
  };

  const renderStars = () => {
    const stars = [];
    const fullStars = Math.floor(currentRating);
    const hasHalfStar = currentRating % 1 !== 0;

    for (let i = 1; i <= 5; i++) {
      let starClass = 'text-gray-300';
      
      if (i <= fullStars) {
        starClass = 'text-yellow-400';
      } else if (i === fullStars + 1 && hasHalfStar) {
        starClass = 'text-yellow-400';
      }

      if (interactive) {
        starClass += ' cursor-pointer hover:text-yellow-300 transition-colors';
      }

      stars.push(
        <FaStar
          key={i}
          className={`${sizeClasses[size]} ${starClass} ${i === fullStars + 1 && hasHalfStar ? 'opacity-50' : ''}`}
          onClick={() => handleStarClick(i as Rating5)}
          onMouseEnter={() => handleStarHover(i as Rating5)}
          onMouseLeave={handleMouseLeave}
          style={{
            clipPath: i === fullStars + 1 && hasHalfStar ? 'polygon(0 0, 50% 0, 50% 100%, 0 100%)' : undefined
          }}
        />
      );
    }

    return stars;
  };

  return (
    <div 
      className={`flex items-center gap-1 ${className}`}
      tabIndex={interactive ? 0 : undefined}
      onKeyDown={handleKeyDown}
      onFocus={handleFocus}
      role={interactive ? 'slider' : undefined}
      aria-label={interactive ? 'Note du film' : undefined}
      aria-valuenow={interactive ? currentRating : undefined}
      aria-valuemin={interactive ? 0 : undefined}
      aria-valuemax={interactive ? 5 : undefined}
      aria-valuetext={interactive ? `${currentRating} étoiles` : undefined}
    >
      <div className="flex">
        {renderStars()}
      </div>
      {showValue && (
        <span className={`ml-2 text-gray-600 ${textSizeClasses[size]}`}>
          {currentRating}/5
        </span>
      )}
      {interactive && isKeyboardMode && (
        <span className={`ml-2 text-gray-500 ${textSizeClasses[size]}`}>
          (Utilisez ← → ou ↑ ↓ pour ajuster)
        </span>
      )}
    </div>
  );
}
