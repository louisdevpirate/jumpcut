'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import StarRatingModern from '@/components/StarRatingModern';
import QuickReviewButton from '@/components/QuickReviewButton';
import { FaSearch, FaSort, FaPlus, FaTrash, FaEye } from 'react-icons/fa';

interface WishlistItem {
  id: number;
  tmdbId: number;
  title: string;
  year: number;
  poster_path: string;
  overview: string;
  dateAdded: string;
}

export default function WishlistPage() {
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('dateAdded'); // 'dateAdded', 'title', 'year'

  useEffect(() => {
    const loadWishlist = () => {
      try {
        const stored = localStorage.getItem('wishlist');
        if (stored) {
          setWishlist(JSON.parse(stored));
        }
      } catch (error) {
        console.error('Erreur lors du chargement de la wishlist:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadWishlist();
  }, []);

  const filteredAndSortedWishlist = useMemo(() => {
    let filtered = wishlist.filter(item =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'title':
          return a.title.localeCompare(b.title);
        case 'year':
          return b.year - a.year;
        case 'dateAdded':
        default:
          return new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime();
      }
    });

    return filtered;
  }, [wishlist, searchQuery, sortBy]);

  const removeFromWishlist = (tmdbId: number) => {
    const updatedWishlist = wishlist.filter(item => item.tmdbId !== tmdbId);
    setWishlist(updatedWishlist);
    localStorage.setItem('wishlist', JSON.stringify(updatedWishlist));
  };

  const addToMyList = async (item: WishlistItem) => {
    try {
      // Simulation pour tester sans API
      console.log('Ajout du film à la collection:', item);
      
      // Retirer de la wishlist
      removeFromWishlist(item.tmdbId);
      alert('Film ajouté à votre collection ! (Mode test)');
    } catch (error) {
      console.error('Erreur lors de l\'ajout:', error);
      alert('Erreur lors de l\'ajout du film');
    }
  };

  const handleReviewSubmit = async (data: { rating: number; review: string }, item: WishlistItem) => {
    try {
      // Simulation pour tester sans API
      console.log('Ajout du film avec critique:', item, data);
      
      // Retirer de la wishlist
      removeFromWishlist(item.tmdbId);
      alert('Film ajouté à votre collection avec votre critique ! (Mode test)');
    } catch (error) {
      console.error('Erreur lors de l\'ajout:', error);
      alert('Erreur lors de l\'ajout du film');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Chargement de votre wishlist...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 text-white">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-bold font-satoshi">🎯 Wishlist</h1>
        <div className="text-sm text-gray-400">
          {wishlist.length} film{wishlist.length > 1 ? 's' : ''} à voir
        </div>
      </div>

      {/* Barre outils */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8 bg-gray-800 p-4 rounded-lg shadow-md">
        {/* Recherche */}
        <div className="relative flex-1">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher dans votre wishlist..."
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-700 bg-gray-900 text-white focus:ring-2 focus:ring-blue-500 outline-none"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Tri */}
        <div className="relative">
          <select
            className="block w-full pl-3 pr-10 py-2 rounded-lg border border-gray-700 bg-gray-900 text-white appearance-none focus:ring-2 focus:ring-blue-500 outline-none"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="dateAdded">Date d'ajout</option>
            <option value="title">Ordre alphabétique</option>
            <option value="year">Par année</option>
          </select>
          <FaSort className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        </div>
      </div>

      {filteredAndSortedWishlist.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <div className="text-6xl mb-4">🎯</div>
          <h3 className="text-xl font-semibold mb-2">
            {wishlist.length === 0 ? 'Votre wishlist est vide' : 'Aucun film trouvé'}
          </h3>
          <p className="mb-6">
            {wishlist.length === 0 
              ? 'Ajoutez des films que vous souhaitez voir depuis la page Films ou les résultats de recherche.'
              : 'Essayez d\'ajuster vos critères de recherche.'
            }
          </p>
          <Link 
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            <FaPlus className="text-sm" />
            Découvrir des films
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredAndSortedWishlist.map((item) => (
            <div key={item.tmdbId} className="bg-gray-800 rounded-xl overflow-hidden hover:bg-gray-700 transition-colors group">
              {/* Affiche */}
              <div className="relative aspect-[2/3]">
                <Image
                  src={item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : '/placeholder-poster.svg'}
                  alt={item.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
                <div className="absolute top-2 right-2">
                  <button
                    onClick={() => removeFromWishlist(item.tmdbId)}
                    className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
                    title="Retirer de la wishlist"
                  >
                    <FaTrash className="text-xs" />
                  </button>
                </div>
              </div>
              
              {/* Informations */}
              <div className="p-4">
                <h3 className="font-semibold text-white truncate mb-1">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-400 mb-3">
                  {item.year}
                </p>
                
                {/* Synopsis */}
                {item.overview && (
                  <p className="text-sm text-gray-300 line-clamp-3 mb-4">
                    {item.overview}
                  </p>
                )}
                
                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => addToMyList(item)}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm"
                  >
                    <FaEye className="text-xs" />
                    J'ai vu ce film
                  </button>
                  
                  <QuickReviewButton
                    movieId={item.tmdbId}
                    movieTitle={item.title}
                    onReviewSubmit={(data) => handleReviewSubmit(data, item)}
                    variant="primary"
                    size="sm"
                  />
                </div>
                
                {/* Date d'ajout */}
                <p className="text-xs text-gray-500 mt-2">
                  Ajouté le {new Date(item.dateAdded).toLocaleDateString('fr-FR')}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
