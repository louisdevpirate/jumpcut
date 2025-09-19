'use client';

import { useState } from 'react';

interface WatchedButtonProps {
  isWatched: boolean;
  onToggle?: (isWatched: boolean) => void;
  movieId?: number;
}

export default function WatchedButton({ isWatched, onToggle, movieId }: WatchedButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleToggle = async () => {
    if (!onToggle) return;
    
    setIsLoading(true);
    try {
      await onToggle(!isWatched);
    } catch (error) {
      console.error('Erreur lors du changement de statut:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleToggle}
      disabled={isLoading}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
        isWatched
          ? 'bg-green-500 text-white hover:bg-green-600'
          : 'bg-neutral-200 text-neutral-700 hover:bg-neutral-300'
      } ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
    >
      {isLoading ? (
        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
      ) : (
        <span className="text-lg">{isWatched ? '✓' : '○'}</span>
      )}
      <span>{isWatched ? 'Vu' : 'Marquer comme vu'}</span>
    </button>
  );
}
