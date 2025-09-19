'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import ProgressBar from "@/components/ProgressBar";
import Pagination from "@/components/Pagination";
import { getFilms } from '@/lib/films-client';
import { getMovieDetails } from "@/lib/tmdb";
import { FaSearch, FaSortAlphaDown, FaSortNumericDown } from 'react-icons/fa';

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

interface Director {
  id: number;
  name: string;
  profile_path: string;
  films: Array<{
    id: number;
    title: string;
    year: number | null;
    watched: boolean;
  }>;
  totalFilms: number;
  watchedFilms: number;
  completionPercentage: number;
}

const DIRECTORS_PER_PAGE = 20;

export default function DirectorsPage() {
  const [directors, setDirectors] = useState<Director[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'mostViewed' | 'alphabetical'>('mostViewed');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    async function loadDirectors() {
      try {
        const films = await getFilms();
        const directorsMap = new Map();
        
        // Traiter seulement les films avec tmdbId
        const filmsWithTmdbId = films.filter(f => f.tmdbId);
        
        // Traiter par batch de 10 pour éviter la surcharge
        const batchSize = 10;
        for (let i = 0; i < filmsWithTmdbId.length; i += batchSize) {
          const batch = filmsWithTmdbId.slice(i, i + batchSize);
          
          // Traitement parallèle du batch
          await Promise.all(batch.map(async (film) => {
            try {
              const tmdbData = await getMovieDetails(film.tmdbId!);
              if (tmdbData?.credits?.crew) {
                const director = tmdbData.credits.crew.find(person => person.job === 'Director');
                if (director && !directorsMap.has(director.id)) {
                  directorsMap.set(director.id, {
                    id: director.id,
                    name: director.name,
                    profile_path: director.profile_path,
                    films: [],
                    totalFilms: 0,
                    watchedFilms: 0,
                    completionPercentage: 0
                  });
                }
                if (director) {
                  directorsMap.get(director.id).films.push({
                    id: film.id,
                    title: film.title,
                    year: film.year,
                    watched: true
                  });
                }
              }
            } catch (error) {
              console.error(`Erreur pour ${film.title}:`, error);
            }
          }));
          
          // Mettre à jour l'état progressivement
          const currentDirectors = Array.from(directorsMap.values()).map(director => ({
            ...director,
            watchedFilms: director.films.length,
            totalFilms: director.films.length, // Pour l'instant, on ne récupère que les films vus
            completionPercentage: 100 // Tous les films affichés sont vus
          }));
          setDirectors(currentDirectors);
          
          // Petite pause entre les batches
          if (i + batchSize < filmsWithTmdbId.length) {
            await new Promise(resolve => setTimeout(resolve, 100));
          }
        }
      } catch (error) {
        console.error('Erreur lors du chargement des réalisateurs:', error);
        setError(true);
      } finally {
        setLoading(false);
      }
    }
    
    loadDirectors();
  }, []);

  // Filtrage et tri
  const filteredAndSortedDirectors = useMemo(() => {
    let filtered = directors.filter(director =>
      director.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    filtered.sort((a, b) => {
      if (sortBy === 'mostViewed') {
        return b.watchedFilms - a.watchedFilms;
      } else {
        return a.name.localeCompare(b.name);
      }
    });

    return filtered;
  }, [directors, searchQuery, sortBy]);

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedDirectors.length / DIRECTORS_PER_PAGE);
  const startIndex = (currentPage - 1) * DIRECTORS_PER_PAGE;
  const endIndex = startIndex + DIRECTORS_PER_PAGE;
  const currentDirectors = filteredAndSortedDirectors.slice(startIndex, endIndex);

  // Top 5 réalisateurs
  const topDirectors = useMemo(() => {
    return directors
      .sort((a, b) => b.watchedFilms - a.watchedFilms)
      .slice(0, 5);
  }, [directors]);

  if (loading) {
    return (
      <div className="min-h-screen py-8">
        <div className="max-w-6xl mx-auto px-6">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-neutral-900 mb-4 font-satoshi">🎬 Réalisateurs</h1>
            <p className="text-neutral-600">Chargement des réalisateurs...</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {Array.from({ length: 10 }, (_, i) => (
              <div key={i} className="bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden">
                <div className="w-full aspect-square bg-gray-200 animate-pulse"></div>
                <div className="p-3">
                  <div className="h-4 bg-gray-200 rounded animate-pulse mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded animate-pulse w-2/3"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen py-8">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center py-16">
            <div className="text-6xl mb-4">⚠️</div>
            <h3 className="text-xl font-semibold text-neutral-900 mb-2">
              Erreur de chargement
            </h3>
            <p className="text-neutral-600">
              Impossible de charger les réalisateurs. Veuillez réessayer.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-6xl mx-auto px-6">
        {/* En-tête */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-neutral-900 mb-4 font-satoshi">🎬 Réalisateurs</h1>
          <p className="text-neutral-600">
            Découvrez les œuvres de vos réalisateurs préférés ({directors.length} réalisateurs)
          </p>
        </div>

        {/* Top 5 réalisateurs */}
        {topDirectors.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-neutral-900 mb-6">🏆 Top Réalisateurs</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
              {topDirectors.map((director) => (
                <Link key={director.id} href={`/directors/${director.id}`}>
                  <div className="bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden hover:shadow-lg transition">
                    <div className="relative aspect-square">
                      <Image
                        src={director.profile_path ? `https://image.tmdb.org/t/p/w185${director.profile_path}` : '/placeholder-director.jpg'}
                        alt={director.name}
                        fill
                        className="object-cover"
                        loading="lazy"
                      />
                    </div>
                    <div className="p-3">
                      <h3 className="font-semibold text-sm truncate mb-1">{director.name}</h3>
                      <p className="text-xs text-neutral-500 mb-2">{director.watchedFilms} films vus</p>
                      <ProgressBar value={director.watchedFilms} total={director.totalFilms} />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Outils : recherche + tri */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div className="relative flex-1">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher un réalisateur..."
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-neutral-300 focus:ring-2 focus:ring-blue-500 outline-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="relative">
            <select
              className="block w-full pl-3 pr-10 py-2 rounded-lg border border-neutral-300 appearance-none focus:ring-2 focus:ring-blue-500 outline-none"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'mostViewed' | 'alphabetical')}
            >
              <option value="mostViewed">Plus vus</option>
              <option value="alphabetical">Ordre alphabétique</option>
            </select>
            <FaSortAlphaDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {/* Liste des réalisateurs */}
        {currentDirectors.length > 0 ? (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {currentDirectors.map((director) => (
                <Link key={director.id} href={`/directors/${director.id}`}>
                  <div className="bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden hover:shadow-lg transition">
                    <div className="relative aspect-square">
                      <Image
                        src={director.profile_path ? `https://image.tmdb.org/t/p/w185${director.profile_path}` : '/placeholder-director.jpg'}
                        alt={director.name}
                        fill
                        className="object-cover"
                        loading="lazy"
                      />
                    </div>
                    <div className="p-3">
                      <h3 className="font-semibold text-sm truncate mb-1">{director.name}</h3>
                      <p className="text-xs text-neutral-500 mb-2">{director.watchedFilms} films vus</p>
                      <ProgressBar value={director.watchedFilms} total={director.totalFilms} />
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Pagination moderne */}
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              showResults={true}
              totalResults={filteredAndSortedDirectors.length}
              resultsPerPage={DIRECTORS_PER_PAGE}
            />
          </>
        ) : (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🎬</div>
            <h3 className="text-xl font-semibold text-neutral-900 mb-2">
              Aucun réalisateur trouvé
            </h3>
            <p className="text-neutral-600 mb-6">
              {searchQuery ? 'Aucun réalisateur ne correspond à votre recherche.' : 'Ajoutez des films à votre collection pour voir les réalisateurs apparaître ici.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
