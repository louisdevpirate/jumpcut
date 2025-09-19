'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getFilms } from '@/lib/films-client';
import StarRatingModern from '@/components/StarRatingModern';
import Pagination from '@/components/Pagination';
import FilmCardClient from '@/components/FilmCardClient';
import QuickReviewButton from '@/components/QuickReviewButton';
import EditFilmButton from '@/components/EditFilmButton';
import { FaSearch, FaSort, FaTh, FaList, FaCalendarAlt, FaStar } from 'react-icons/fa';

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
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('alphabetical'); // 'alphabetical', 'year', 'dateWatched', 'rating'
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const filmsPerPage = 50;

  useEffect(() => {
    const fetchFilms = async () => {
      try {
        const data = await getFilms();
        setFilms(data);
      } catch (error) {
        console.error('Erreur lors du chargement des films:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchFilms();
  }, []);

  const filteredAndSortedFilms = useMemo(() => {
    let sorted = [...films];

    // Search
    if (searchQuery) {
      sorted = sorted.filter(film =>
        film.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        film.myReview.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Sort
    sorted.sort((a, b) => {
      switch (sortBy) {
        case 'year':
          return (b.year || 0) - (a.year || 0);
        case 'dateWatched':
          return new Date(b.dateWatched).getTime() - new Date(a.dateWatched).getTime();
        case 'rating':
          return b.myRating - a.myRating;
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
    const ratedFilms = films.filter(f => f.myRating > 0);
    
    return {
      total: films.length,
      watched: watchedFilms.length,
      rated: ratedFilms.length,
      averageRating: ratedFilms.length > 0 
        ? (ratedFilms.reduce((sum, f) => sum + f.myRating, 0) / ratedFilms.length).toFixed(1)
        : '0.0',
      latestYear: Math.max(...films.map(f => f.year || 0)),
      oldestYear: Math.min(...films.filter(f => f.year).map(f => f.year!))
    };
  }, [films]);

  const handleReviewSubmit = async (filmId: number, data: { rating: number; review: string }) => {
    try {
      const response = await fetch(`/api/films/${filmId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          rating: data.rating,
          review: data.review
        }),
      });

      if (response.ok) {
        // Mettre à jour l'état local
        setFilms(prevFilms => 
          prevFilms.map(film => 
            film.id === filmId 
              ? { 
                  ...film, 
                  myRating: data.rating * 2, 
                  myReview: data.review 
                }
              : film
          )
        );
        alert('Critique mise à jour !');
      } else {
        alert('Erreur lors de la mise à jour');
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
      alert('Erreur lors de la mise à jour');
    }
  };

  const handleFilmEdit = async (filmId: number, data: { title: string; year: number; posterUrl?: string }) => {
    try {
      const response = await fetch(`/api/films/${filmId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        // Mettre à jour l'état local
        setFilms(prevFilms => 
          prevFilms.map(film => 
            film.id === filmId 
              ? { 
                  ...film, 
                  title: data.title,
                  year: data.year
                }
              : film
          )
        );
        alert('Film mis à jour !');
      } else {
        alert('Erreur lors de la mise à jour');
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
      alert('Erreur lors de la mise à jour');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Chargement de votre liste...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 text-white">
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
                <div key={film.id} className="group">
                  <FilmCardClient
                    id={film.id}
                    title={film.title}
                    year={film.year}
                    tmdbId={film.tmdbId}
                    myRating={film.myRating}
                  />
                  
                  {/* Actions rapides */}
                  <div className="mt-3 flex justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <QuickReviewButton
                      movieId={film.id}
                      movieTitle={film.title}
                      onReviewSubmit={(data) => handleReviewSubmit(film.id, data)}
                      initialRating={film.myRating / 2}
                      initialReview={film.myReview}
                      variant="minimal"
                      size="sm"
                    />
                    <EditFilmButton
                      film={film}
                      onSave={(data) => handleFilmEdit(film.id, data)}
                      variant="minimal"
                      size="sm"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Vue liste */}
          {viewMode === 'list' && (
            <div className="space-y-4 mb-8">
              {currentFilms.map((film) => (
                <div key={film.id} className="bg-gray-800 rounded-lg p-4 hover:bg-gray-700 transition-colors">
                  <div className="flex gap-4">
                    {/* Affiche */}
                    <div className="flex-shrink-0">
                      <div className="relative w-16 h-24 rounded-lg overflow-hidden">
                        <Image
                          src={film.tmdbId ? `https://image.tmdb.org/t/p/w200${film.tmdbId}` : '/placeholder-poster.svg'}
                          alt={film.title}
                          fill
                          className="object-cover"
                          loading="lazy"
                        />
                      </div>
                    </div>
                    
                    {/* Informations */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-white truncate mb-1">
                            {film.title}
                          </h3>
                          <div className="flex items-center gap-4 text-sm text-gray-400 mb-2">
                            <span>{film.year || 'N/A'}</span>
                            <span className="flex items-center gap-1">
                              <FaCalendarAlt />
                              {new Date(film.dateWatched).toLocaleDateString('fr-FR')}
                            </span>
                          </div>
                          
                          {/* Note */}
                          {film.myRating > 0 && (
                            <div className="mb-2">
                              <StarRatingModern 
                                rating={film.myRating / 2} 
                                interactive={false} 
                                size="sm" 
                                showValue={true}
                              />
                            </div>
                          )}
                          
                          {/* Critique */}
                          {film.myReview && (
                            <p className="text-sm text-gray-300 line-clamp-2">
                              "{film.myReview}"
                            </p>
                          )}
                        </div>
                        
                        {/* Actions */}
                        <div className="flex gap-2 ml-4">
                          <QuickReviewButton
                            movieId={film.id}
                            movieTitle={film.title}
                            onReviewSubmit={(data) => handleReviewSubmit(film.id, data)}
                            initialRating={film.myRating / 2}
                            initialReview={film.myReview}
                            variant="secondary"
                            size="sm"
                          />
                          <EditFilmButton
                            film={film}
                            onSave={(data) => handleFilmEdit(film.id, data)}
                            variant="secondary"
                            size="sm"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
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