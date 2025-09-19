'use client';

import { useState } from 'react';
import { FaHeart, FaHeartBroken } from 'react-icons/fa';

interface WishlistButtonProps {
  tmdbId: number;
  title: string;
  year: number;
  poster_path: string;
  overview: string;
  variant?: 'primary' | 'secondary' | 'minimal';
  size?: 'sm' | 'md' | 'lg';
}

export default function WishlistButton({
  tmdbId,
  title,
  year,
  poster_path,
  overview,
  variant = 'secondary',
  size = 'md'
}: WishlistButtonProps) {
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Vérifier si le film est déjà dans la wishlist
  useState(() => {
    try {
      const stored = localStorage.getItem('wishlist');
      if (stored) {
        const wishlist = JSON.parse(stored);
        setIsInWishlist(wishlist.some((item: any) => item.tmdbId === tmdbId));
      }
    } catch (error) {
      console.error('Erreur lors de la vérification de la wishlist:', error);
    }
  });

  const toggleWishlist = async () => {
    setIsLoading(true);
    
    try {
      const stored = localStorage.getItem('wishlist');
      let wishlist = stored ? JSON.parse(stored) : [];
      
      if (isInWishlist) {
        // Retirer de la wishlist
        wishlist = wishlist.filter((item: any) => item.tmdbId !== tmdbId);
        setIsInWishlist(false);
      } else {
        // Ajouter à la wishlist
        const newItem = {
          id: Date.now(),
          tmdbId,
          title,
          year,
          poster_path,
          overview,
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
    minimal: 'bg-transparent text-red-500 hover:bg-red-50 border border-red-500'
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  };

  return (
    <button
      onClick={toggleWishlist}
      disabled={isLoading}
      className={`flex items-center gap-2 rounded-lg font-medium transition-colors ${buttonClasses[variant]} ${sizeClasses[size]} ${
        isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
      }`}
    >
      {isLoading ? (
        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
      ) : isInWishlist ? (
        <FaHeart className="text-sm" />
      ) : (
        <FaHeartBroken className="text-sm" />
      )}
      <span>
        {isInWishlist ? 'Dans ma wishlist' : 'Ajouter à ma wishlist'}
      </span>
    </button>
  );
}
