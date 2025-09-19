'use client';

import { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { loadFilms } from '@/lib/films';
import StarRating from '@/components/StarRating';
import { FaSearch, FaSort } from 'react-icons/fa';

interface Film {
  id: number;
  tmdbId: number | null;
  title: string;
  year: number | null;
  myRating: number;
  positives: string;
  negatives: string;
  myReview: string;
  dateWatched: string;
}

export default function MyListPage() {
  const [films, setFilms] = useState<Film[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'alphabetical' | 'year' | 'dateWatched' | 'rating'>('dateWatched');
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  const filmsPerPage = 50;

  useEffect(() => {
    const fetchFilms = async () => {
      try {
        const data = await loadFilms();
        setFilms(data);
      } catch (error) {
        console.error('Erreur lors du chargement des films:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFilms();
  }, []);

  // Filtrage et tri des films
  const filteredAndSortedFilms = useMemo(() => {
    let filtered = films;

    // Filtrage par recherche
    if (searchQuery) {
      filtered = films.filter(film =>
        film.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Tri
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'alphabetical':
          return a.title.localeCompare(b.title);
        case 'year':
          return (b.year || 0) - (a.year || 0);
        case 'dateWatched':
          return new Date(b.dateWatched).getTime() - new Date(a.dateWatched).getTime();
        case 'rating':
          return b.myRating - a.myRating;
        default:
          return 0;
      }
    });

    return sorted;
  }, [films, searchQuery, sortBy]);

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedFilms.length / filmsPerPage);
  const startIndex = (currentPage - 1) * filmsPerPage;
  const endIndex = startIndex + filmsPerPage;
  const currentFilms = filteredAndSortedFilms.slice(startIndex, endIndex);

  // Statistiques
  const stats = useMemo(() => {
    const watchedFilms = films.filter(f => f.myRating > 0);
    return {
      total: films.length,
      watched: watchedFilms.length,
      averageRating: watchedFilms.length > 0 
        ? (watchedFilms.reduce((sum, f) => sum + f.myRating, 0) / watchedFilms.length).toFixed(1)
        : '0.0',
      latestYear: Math.max(...films.map(f => f.year || 0)),
      oldestYear: Math.min(...films.filter(f => f.year).map(f => f.year!))
    };
  }, [films]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white">Chargement de votre collection...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-7xl mx-auto px-6 py-12">
        
        {/* En-tête */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">🎞️ Ma Liste</h1>
          <p className="text-gray-400">
            {stats.total} film{stats.total > 1 ? 's' : ''} dans votre collection
          </p>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gray-800 p-4 rounded-lg">
            <div className="text-2xl font-bold text-blue-400">{stats.total}</div>
            <div className="text-sm text-gray-400">Total</div>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg">
            <div className="text-2xl font-bold text-green-400">{stats.watched}</div>
            <div className="text-sm text-gray-400">Vus</div>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg">
            <div className="text-2xl font-bold text-yellow-400">{stats.averageRating}</div>
            <div className="text-sm text-gray-400">Note moyenne</div>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg">
            <div className="text-2xl font-bold text-purple-400">{stats.latestYear}</div>
            <div className="text-sm text-gray-400">Plus récent</div>
          </div>
        </div>

        {/* Barre d'outils */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          
          {/* Recherche */}
          <div className="relative flex-1 max-w-md">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher dans mes films..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-800 text-white rounded-lg border border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
          </div>
          
          {/* Tri */}
          <div className="relative">
            <FaSort className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="pl-10 pr-8 py-3 bg-gray-800 text-white rounded-lg border border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none appearance-none"
            >
              <option value="dateWatched">Par date de visionnage</option>
              <option value="alphabetical">Ordre alphabétique</option>
              <option value="year">Par année de sortie</option>
              <option value="rating">Par note</option>
            </select>
          </div>
        </div>

        {/* Liste des films */}
        {currentFilms.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            {currentFilms.map((film) => (
              <Link key={film.id} href={`/films/${film.id}`}>
                <div className="film-card bg-gray-800 rounded-lg overflow-hidden hover:bg-gray-700 transition">
                  <div className="relative aspect-[2/3]">
                    <Image
                      src={film.tmdbId ? `https://image.tmdb.org/t/p/w500${film.tmdbId}` : '/placeholder-poster.svg'}
                      alt={film.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-3">
                    <h3 className="font-semibold text-sm text-white truncate mb-1">
                      {film.title}
                    </h3>
                    <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
                      <span>{film.year || 'N/A'}</span>
                      {film.myRating > 0 && (
                        <span>⭐ {film.myRating}/10</span>
                      )}
                    </div>
                    {film.myRating > 0 && (
                      <StarRating rating={Math.round(film.myRating / 2)} interactive={false} size="sm" />
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🎬</div>
            <h3 className="text-xl font-semibold text-white mb-2">
              {searchQuery ? 'Aucun film trouvé' : 'Aucun film dans votre collection'}
            </h3>
            <p className="text-gray-400 mb-6">
              {searchQuery ? 'Essayez avec d\'autres mots-clés' : 'Commencez par ajouter votre premier film !'}
            </p>
            {!searchQuery && (
              <Link href="/">
                <button className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition">
                  Explorer les films
                </button>
              </Link>
            )}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-12 gap-2">
            <button
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
              className="px-3 py-2 rounded bg-gray-800 text-white hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              «
            </button>
            
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const page = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i;
              if (page > totalPages) return null;
              
              return (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-2 rounded ${
                    currentPage === page
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-800 text-white hover:bg-gray-700'
                  }`}
                >
                  {page}
                </button>
              );
            })}
            
            <button
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
              className="px-3 py-2 rounded bg-gray-800 text-white hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              »
            </button>
          </div>
        )}

        {/* Informations de pagination */}
        <div className="text-center mt-6 text-gray-400 text-sm">
          Affichage de {startIndex + 1} à {Math.min(endIndex, filteredAndSortedFilms.length)} sur {filteredAndSortedFilms.length} films
        </div>

      </div>
    </div>
  );
}
