'use client';

import { useState } from 'react';
import { FaStar, FaStarHalfAlt } from 'react-icons/fa';

interface StarRatingModernProps {
  rating: number; // Note sur 5 (0-5)
  onRatingChange?: (rating: number) => void;
  interactive?: boolean;
  size?: 'sm' | 'md' | 'lg';
  showValue?: boolean;
}

export default function StarRatingModern({ 
  rating, 
  onRatingChange, 
  interactive = false, 
  size = 'md',
  showValue = false 
}: StarRatingModernProps) {
  const [hoverRating, setHoverRating] = useState(0);
  
  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
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

  const renderStar = (index: number) => {
    const currentRating = hoverRating || rating;
    const starValue = index + 1;
    
    if (currentRating >= starValue) {
      return (
        <FaStar 
          className={`${sizeClasses[size]} text-yellow-400 ${interactive ? 'cursor-pointer hover:text-yellow-500' : ''}`}
          onClick={() => handleStarClick(starValue)}
          onMouseEnter={() => handleStarHover(starValue)}
        />
      );
    } else if (currentRating >= starValue - 0.5) {
      return (
        <FaStarHalfAlt 
          className={`${sizeClasses[size]} text-yellow-400 ${interactive ? 'cursor-pointer hover:text-yellow-500' : ''}`}
          onClick={() => handleStarClick(starValue - 0.5)}
          onMouseEnter={() => handleStarHover(starValue - 0.5)}
        />
      );
    } else {
      return (
        <FaStar 
          className={`${sizeClasses[size]} text-gray-300 ${interactive ? 'cursor-pointer hover:text-yellow-400' : ''}`}
          onClick={() => handleStarClick(starValue)}
          onMouseEnter={() => handleStarHover(starValue)}
        />
      );
    }
  };

  return (
    <div className="flex items-center gap-1" onMouseLeave={handleMouseLeave}>
      {[0, 1, 2, 3, 4].map((index) => (
        <span key={index}>
          {renderStar(index)}
        </span>
      ))}
      {showValue && (
        <span className={`ml-2 text-gray-600 ${sizeClasses[size]}`}>
          {rating.toFixed(1)}/5
        </span>
      )}
    </div>
  );
}
