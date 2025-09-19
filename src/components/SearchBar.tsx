'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { searchMovies } from '@/lib/tmdb';

interface SearchResult {
  id: number;
  title: string;
  release_date: string;
  poster_path: string;
}

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (query.length > 2) {
      setIsLoading(true);
      const timeoutId = setTimeout(async () => {
        try {
          const searchResults = await searchMovies(query);
          setResults(searchResults.slice(0, 5)); // Limiter à 5 résultats
          setIsOpen(true);
        } catch (error) {
          console.error('Erreur lors de la recherche:', error);
          setResults([]);
        } finally {
          setIsLoading(false);
        }
      }, 300); // Délai de 300ms pour éviter trop de requêtes

      return () => clearTimeout(timeoutId);
    } else {
      setResults([]);
      setIsOpen(false);
    }
  }, [query]);

  const handleResultClick = (movieId: number) => {
    setIsOpen(false);
    setQuery('');
    // Rediriger vers une page de détail du film (à créer)
    router.push(`/search/${movieId}`);
  };

  const handleInputFocus = () => {
    if (results.length > 0) {
      setIsOpen(true);
    }
  };

  const handleInputBlur = () => {
    // Délai pour permettre le clic sur un résultat
    setTimeout(() => setIsOpen(false), 200);
  };

  return (
    <div className="relative">
      <div className="hidden md:flex items-center bg-gray-800/50 backdrop-blur-sm rounded-full px-4 py-2 border border-gray-700">
        <input
          type="text"
          placeholder="Rechercher un film..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          className="bg-transparent outline-none text-sm text-white w-48 placeholder-gray-400"
        />
        {isLoading && (
          <div className="ml-2 w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        )}
      </div>

      {/* Résultats de recherche */}
      {isOpen && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-gray-900 border border-gray-700 rounded-lg shadow-xl z-50 max-h-80 overflow-y-auto">
          {results.map((movie) => (
            <div
              key={movie.id}
              onClick={() => handleResultClick(movie.id)}
              className="flex items-center gap-3 p-3 hover:bg-gray-800 cursor-pointer transition-colors"
            >
              <div className="w-12 h-16 rounded overflow-hidden flex-shrink-0">
                <img
                  src={movie.poster_path ? `https://image.tmdb.org/t/p/w92${movie.poster_path}` : '/placeholder-poster.svg'}
                  alt={movie.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-white truncate">
                  {movie.title}
                </div>
                <div className="text-sm text-gray-400">
                  {new Date(movie.release_date).getFullYear()}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Version mobile */}
      <div className="md:hidden">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 text-neutral-600 hover:text-blue-600 transition"
        >
          🔍
        </button>
        
        {isOpen && (
          <div className="absolute top-full right-0 mt-2 bg-white border border-neutral-200 rounded-lg shadow-lg z-50 w-80">
            <div className="p-3 border-b border-neutral-200">
              <input
                type="text"
                placeholder="Rechercher un film..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full bg-transparent outline-none text-sm text-neutral-700"
              />
            </div>
            {results.length > 0 && (
              <div className="max-h-60 overflow-y-auto">
                {results.map((movie) => (
                  <div
                    key={movie.id}
                    onClick={() => handleResultClick(movie.id)}
                    className="flex items-center gap-3 p-3 hover:bg-neutral-50 cursor-pointer transition-colors"
                  >
                    <div className="w-12 h-16 rounded overflow-hidden flex-shrink-0">
                      <img
                        src={movie.poster_path ? `https://image.tmdb.org/t/p/w92${movie.poster_path}` : '/placeholder-poster.jpg'}
                        alt={movie.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-neutral-900 truncate">
                        {movie.title}
                      </div>
                      <div className="text-sm text-neutral-500">
                        {new Date(movie.release_date).getFullYear()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
