'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { FaSearch, FaTimes, FaStar, FaCalendarAlt, FaFilm } from 'react-icons/fa';
import { useQuickReview } from '@/hooks/useFilms';
import { PosterImage } from './OptimizedImage';

interface SearchResult {
  id: number;
  title: string;
  release_date: string;
  poster_path: string;
  vote_average: number;
  overview: string;
  media_type: 'movie' | 'tv' | 'person';
}

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const { isOpen: isQuickReviewOpen, openQuickReview } = useQuickReview();

  // Focus sur l'input quand la modale s'ouvre
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Recherche avec debounce
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const timeoutId = setTimeout(async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/tmdb/search?query=${encodeURIComponent(query)}&language=fr-FR`);
        if (response.ok) {
          const data = await response.json();
          setResults(data.results || []);
        }
      } catch (error) {
        console.error('Erreur de recherche:', error);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query]);

  // Navigation au clavier
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!results.length) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < results.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && results[selectedIndex]) {
          handleResultClick(results[selectedIndex]);
        }
        break;
      case 'Escape':
        onClose();
        break;
    }
  };

  const handleResultClick = (result: SearchResult) => {
    if (result.media_type === 'movie') {
      // Ouvrir la page du film
      window.location.href = `/movie/${result.id}`;
    } else if (result.media_type === 'person') {
      // Ouvrir la page de la personnalité
      window.location.href = `/actors/${result.id}`;
    }
    onClose();
  };

  const handleQuickReview = (e: React.MouseEvent, result: SearchResult) => {
    e.stopPropagation();
    if (result.media_type === 'movie') {
      openQuickReview({
        tmdbId: result.id,
        title: result.title,
        year: result.release_date ? new Date(result.release_date).getFullYear() : new Date().getFullYear(),
        posterUrl: result.poster_path
      });
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).getFullYear();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/70 z-[9998]"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="fixed top-20 left-1/2 transform -translate-x-1/2 w-full max-w-2xl mx-4 z-[9999]">
        <div className="bg-gray-900 rounded-xl shadow-2xl border border-gray-700 overflow-hidden">
          {/* Header */}
          <div className="p-4 border-b border-gray-700">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                ref={inputRef}
                type="text"
                placeholder="Rechercher un film, une série ou une personnalité..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full pl-10 pr-10 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
              <button
                onClick={onClose}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
              >
                <FaTimes className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Results */}
          <div className="max-h-96 overflow-y-auto">
            {isLoading ? (
              <div className="p-8 text-center">
                <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-400">Recherche en cours...</p>
              </div>
            ) : results.length > 0 ? (
              <div className="p-2">
                {results.map((result, index) => (
                  <div
                    key={`${result.media_type}-${result.id}`}
                    className={`p-3 rounded-lg cursor-pointer transition-colors ${
                      index === selectedIndex 
                        ? 'bg-blue-600/20 border border-blue-500/30' 
                        : 'hover:bg-gray-800'
                    }`}
                    onClick={() => handleResultClick(result)}
                  >
                    <div className="flex items-center gap-3">
                      {/* Poster/Photo */}
                      <div className="relative w-12 h-16 rounded-lg overflow-hidden flex-shrink-0">
                        <PosterImage
                          src={result.poster_path}
                          alt={result.title}
                          width={48}
                          height={64}
                          className="object-cover"
                        />
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-white truncate">
                            {result.title}
                          </h3>
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            result.media_type === 'movie' 
                              ? 'bg-blue-500/20 text-blue-400' 
                              : result.media_type === 'tv'
                              ? 'bg-green-500/20 text-green-400'
                              : 'bg-purple-500/20 text-purple-400'
                          }`}>
                            {result.media_type === 'movie' ? 'Film' : 
                             result.media_type === 'tv' ? 'Série' : 'Personnalité'}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-3 text-sm text-gray-400 mb-2">
                          {result.release_date && (
                            <div className="flex items-center gap-1">
                              <FaCalendarAlt className="w-3 h-3" />
                              <span>{formatDate(result.release_date)}</span>
                            </div>
                          )}
                          {result.vote_average > 0 && (
                            <div className="flex items-center gap-1">
                              <FaStar className="w-3 h-3 text-yellow-400" />
                              <span>{result.vote_average.toFixed(1)}</span>
                            </div>
                          )}
                        </div>

                        {result.overview && (
                          <p className="text-xs text-gray-500 line-clamp-2">
                            {result.overview}
                          </p>
                        )}
                      </div>

                      {/* Actions */}
                      {result.media_type === 'movie' && (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={(e) => handleQuickReview(e, result)}
                            className="p-2 bg-yellow-500 text-black rounded-lg hover:bg-yellow-400 transition-colors"
                            title="Critiquer rapidement"
                          >
                            <FaStar className="w-4 h-4" />
                          </button>
                          <Link href={`/movie/${result.id}`}>
                            <button className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                              <FaFilm className="w-4 h-4" />
                            </button>
                          </Link>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : query ? (
              <div className="p-8 text-center">
                <div className="text-4xl mb-4">🔍</div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  Aucun résultat trouvé
                </h3>
                <p className="text-gray-400">
                  Essayez avec d'autres mots-clés
                </p>
              </div>
            ) : (
              <div className="p-8 text-center">
                <div className="text-4xl mb-4">🎬</div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  Recherchez votre prochain film
                </h3>
                <p className="text-gray-400">
                  Tapez le nom d'un film, d'une série ou d'une personnalité
                </p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-3 border-t border-gray-700 bg-gray-800">
            <div className="flex items-center justify-between text-xs text-gray-500">
              <div className="flex items-center gap-4">
                <span>↑↓ Naviguer</span>
                <span>↵ Sélectionner</span>
                <span>Esc Fermer</span>
              </div>
              <span>Powered by TMDb</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
