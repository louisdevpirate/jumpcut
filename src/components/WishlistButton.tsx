'use client';

import { useState, useEffect } from 'react';
import { HeartIcon } from './Icons';

interface WishlistButtonProps {
  movieId: number;
  movieTitle: string;
  tmdbId?: number;
  title?: string;
  year?: number;
  poster_path?: string;
  overview?: string;
  variant?: 'primary' | 'secondary' | 'minimal' | 'carousel' | 'hero';
  size?: 'sm' | 'md' | 'lg';
}

export default function WishlistButton({
  movieId,
  movieTitle,
  tmdbId,
  title,
  year,
  poster_path,
  overview,
  variant = 'secondary',
  size = 'md'
}: WishlistButtonProps) {
  // Utiliser les props simplifiées si les props détaillées ne sont pas fournies
  const finalTmdbId = tmdbId || movieId;
  const finalTitle = title || movieTitle;
  const finalYear = year || new Date().getFullYear();
  const finalPosterPath = poster_path || '';
  const finalOverview = overview || '';
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Vérifier si le film est déjà dans la wishlist
  useEffect(() => {
    try {
      const stored = localStorage.getItem('wishlist');
      if (stored) {
        const wishlist = JSON.parse(stored);
        setIsInWishlist(wishlist.some((item: any) => item.tmdbId === finalTmdbId));
      }
    } catch (error) {
      console.error('Erreur lors de la vérification de la wishlist:', error);
    }
  }, [finalTmdbId]);

  const toggleWishlist = async () => {
    setIsLoading(true);
    
    try {
      const stored = localStorage.getItem('wishlist');
      let wishlist = stored ? JSON.parse(stored) : [];
      
      if (isInWishlist) {
        // Retirer de la wishlist
        wishlist = wishlist.filter((item: any) => item.tmdbId !== finalTmdbId);
        setIsInWishlist(false);
      } else {
        // Ajouter à la wishlist
        const newItem = {
          id: Date.now(),
          tmdbId: finalTmdbId,
          title: finalTitle,
          year: finalYear,
          poster_path: finalPosterPath,
          overview: finalOverview,
          dateAdded: new Date().toISOString()
        };
        wishlist.push(newItem);
        setIsInWishlist(true);
      }
      
      localStorage.setItem('wishlist', JSON.stringify(wishlist));
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la wishlist:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const buttonClasses = {
    primary: 'bg-red-500 text-white hover:bg-red-600',
    secondary: 'bg-gray-100 text-gray-700 hover:bg-gray-200',
    minimal: 'bg-transparent text-red-500 hover:bg-red-50 border border-red-500',
    carousel: 'p-2 bg-white/20 rounded-full hover:bg-white/30 transition',
    hero: 'bg-gray-200 text-gray-700 hover:bg-gray-600'
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
    hero: 'px-6 py-3 text-base'
  };

  return (
    <button
      onClick={toggleWishlist}
      disabled={isLoading}
      className={`flex items-center gap-2 rounded-lg font-medium transition-colors ${buttonClasses[variant]} ${variant === 'carousel' ? '' : sizeClasses[variant === 'hero' ? 'hero' : size]} ${
        isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
      }`}
    >
      {isLoading ? (
        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
      ) : (
        <HeartIcon 
          className={`w-4 h-4 ${isInWishlist ? 'text-red-500 fill-red-500' : variant === 'hero' ? 'text-gray-700' : 'text-white'}`} 
        />
      )}
      {variant === 'carousel' ? null : (
        <span>
          {isInWishlist ? 'Dans ma wishlist' : 'Ajouter à ma wishlist'}
        </span>
      )}
    </button>
  );
}
