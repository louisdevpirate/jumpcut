'use client';

import { useState, useMemo } from 'react';
import { useFilms, FilmLocal, Rating5 } from '@/hooks/useFilms';
import FilmCard from '@/components/FilmCard';
import Pagination from '@/components/Pagination';
import { FaSearch, FaSort, FaTh, FaList, FaCalendarAlt, FaStar } from 'react-icons/fa';

export default function MyListPage() {
  const { films, loading, error, fetchFilms } = useFilms();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('dateWatched'); // 'alphabetical', 'year', 'dateWatched', 'rating'
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const filmsPerPage = 50;

  const filteredAndSortedFilms = useMemo(() => {
    let sorted = [...films];

    // Search
    if (searchQuery) {
      sorted = sorted.filter(film =>
        film.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        film.quickReview140?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Sort
    sorted.sort((a, b) => {
      switch (sortBy) {
        case 'year':
          return b.year - a.year;
        case 'dateWatched':
          return new Date(b.dateWatched || 0).getTime() - new Date(a.dateWatched || 0).getTime();
        case 'rating':
          return (b.rating5 || 0) - (a.rating5 || 0);
        case 'alphabetical':
        default:
          return a.title.localeCompare(b.title);
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
    const watchedFilms = films;
    const ratedFilms = films.filter(f => (f.rating5 || 0) > 0);
    
    return {
      total: films.length,
      watched: watchedFilms.length,
      rated: ratedFilms.length,
      averageRating: ratedFilms.length > 0 
        ? (ratedFilms.reduce((sum, f) => sum + (f.rating5 || 0), 0) / ratedFilms.length).toFixed(1)
        : '0.0',
      latestYear: Math.max(...films.map(f => f.year || 0)),
      oldestYear: Math.min(...films.filter(f => f.year).map(f => f.year!))
    };
  }, [films]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Chargement de votre liste...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">❌</div>
          <p className="text-white text-lg mb-4">Erreur lors du chargement</p>
          <p className="text-gray-400 mb-4">{error}</p>
          <button
            onClick={() => fetchFilms()}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 text-white pt-48">
      <h1 className="text-4xl font-bold mb-8 font-satoshi">📚 Ma Liste</h1>

      {/* Statistiques */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        <div className="bg-gray-800 p-4 rounded-lg">
          <div className="text-2xl font-bold text-blue-400">{stats.total}</div>
          <div className="text-sm text-gray-400">Total</div>
        </div>
        <div className="bg-gray-800 p-4 rounded-lg">
          <div className="text-2xl font-bold text-green-400">{stats.watched}</div>
          <div className="text-sm text-gray-400">Films vus</div>
        </div>
        <div className="bg-gray-800 p-4 rounded-lg">
          <div className="text-2xl font-bold text-purple-400">{stats.rated}</div>
          <div className="text-sm text-gray-400">Films notés</div>
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

      {/* Barre outils */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8 bg-gray-800 p-4 rounded-lg shadow-md">
        {/* Recherche */}
        <div className="relative flex-1">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher dans mes films..."
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-700 bg-gray-900 text-white focus:ring-2 focus:ring-blue-500 outline-none"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>

        {/* Tri */}
        <div className="relative">
          <select
            className="block w-full pl-3 pr-10 py-2 rounded-lg border border-gray-700 bg-gray-900 text-white appearance-none focus:ring-2 focus:ring-blue-500 outline-none"
            value={sortBy}
            onChange={(e) => {
              setSortBy(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="alphabetical">Ordre alphabétique</option>
            <option value="year">Par année de sortie</option>
            <option value="dateWatched">Par date de visionnage</option>
            <option value="rating">Par note</option>
          </select>
          <FaSort className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        </div>

        {/* Mode d'affichage */}
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-lg transition-colors ${
              viewMode === 'grid' 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            <FaTh />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-lg transition-colors ${
              viewMode === 'list' 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            <FaList />
          </button>
        </div>
      </div>

      {filteredAndSortedFilms.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-xl mb-4">Aucun film trouvé correspondant à votre recherche.</p>
          <p>Essayez d'ajuster vos critères.</p>
        </div>
      ) : (
        <>
          {/* Vue grille */}
          {viewMode === 'grid' && (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 mb-8">
              {currentFilms.map((film) => (
                <FilmCard
                  key={film.tmdbId}
                  movie={{
                    id: film.tmdbId,
                    title: film.title,
                    release_date: film.year.toString(),
                    poster_path: film.posterUrl ? `https://image.tmdb.org/t/p/w300${film.posterUrl}` : '',
                    vote_average: 0,
                    overview: film.quickReview140
                  }}
                  variant="default"
                  showQuickReview={true}
                  userRating={film.rating5}
                  userReview={film.quickReview140}
                  isWatched={true}
                />
              ))}
            </div>
          )}

          {/* Vue liste */}
          {viewMode === 'list' && (
            <div className="space-y-4 mb-8">
              {currentFilms.map((film) => (
                <FilmCard
                  key={film.tmdbId}
                  movie={{
                    id: film.tmdbId,
                    title: film.title,
                    release_date: film.year.toString(),
                    poster_path: film.posterUrl ? `https://image.tmdb.org/t/p/w300${film.posterUrl}` : '',
                    vote_average: 0,
                    overview: film.quickReview140
                  }}
                  variant="list"
                  showQuickReview={true}
                  userRating={film.rating5}
                  userReview={film.quickReview140}
                  isWatched={true}
                />
              ))}
            </div>
          )}

          {/* Pagination */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            showResults={true}
            totalResults={filteredAndSortedFilms.length}
            resultsPerPage={filmsPerPage}
          />
        </>
      )}
    </div>
  );
}