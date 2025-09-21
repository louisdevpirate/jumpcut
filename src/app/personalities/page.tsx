'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import ProgressBar from "@/components/ProgressBar";
import Pagination from "@/components/Pagination";
import { getFilms } from '@/lib/films-client';
import { getMovieDetails } from "@/lib/tmdb";
import { FilmGridSkeleton } from '@/components/Skeletons';
import { FaSearch, FaSortAlphaDown, FaFilter } from 'react-icons/fa';
import { ProfileImage } from '@/components/OptimizedImage';

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

interface Person {
  id: number;
  name: string;
  profile_path: string;
  type: 'actor' | 'director';
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

const PERSONS_PER_PAGE = 24;

export default function PersonalitiesPage() {
  const [persons, setPersons] = useState<Person[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'actors' | 'directors'>('all');
  const [sortBy, setSortBy] = useState<'mostViewed' | 'alphabetical'>('mostViewed');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    async function loadPersons() {
      try {
        const films = await getFilms();
        const personsMap = new Map();
        
        // Traiter seulement les films avec tmdbId
        const filmsWithTmdbId = films.filter(f => f.tmdbId);
        
        // Traiter seulement les 50 premiers films pour améliorer les performances
        const filmsToProcess = filmsWithTmdbId.slice(0, 50);
        
        // Traiter par batch de 5 pour éviter la surcharge
        const batchSize = 5;
        for (let i = 0; i < filmsToProcess.length; i += batchSize) {
          const batch = filmsToProcess.slice(i, i + batchSize);
          
          // Traitement parallèle du batch
          await Promise.all(batch.map(async (film) => {
            try {
              const tmdbData = await getMovieDetails(film.tmdbId!);
              
              // Acteurs (seulement les 2 premiers pour limiter)
              if (tmdbData?.credits?.cast) {
                tmdbData.credits.cast.slice(0, 2).forEach(actor => {
                  if (!personsMap.has(`actor-${actor.id}`)) {
                    personsMap.set(`actor-${actor.id}`, {
                      id: actor.id,
                      name: actor.name,
                      profile_path: actor.profile_path,
                      type: 'actor' as const,
                      films: [],
                      totalFilms: 0,
                      watchedFilms: 0,
                      completionPercentage: 0
                    });
                  }
                  personsMap.get(`actor-${actor.id}`).films.push({
                    id: film.id,
                    title: film.title,
                    year: film.year,
                    watched: true
                  });
                });
              }
              
              // Réalisateurs
              if (tmdbData?.credits?.crew) {
                const director = tmdbData.credits.crew.find(person => person.job === 'Director');
                if (director && !personsMap.has(`director-${director.id}`)) {
                  personsMap.set(`director-${director.id}`, {
                    id: director.id,
                    name: director.name,
                    profile_path: director.profile_path,
                    type: 'director' as const,
                    films: [],
                    totalFilms: 0,
                    watchedFilms: 0,
                    completionPercentage: 0
                  });
                }
                if (director) {
                  personsMap.get(`director-${director.id}`).films.push({
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
          const currentPersons = Array.from(personsMap.values()).map(person => ({
            ...person,
            watchedFilms: person.films.length,
            totalFilms: person.films.length, // Pour l'instant, on ne récupère que les films vus
            completionPercentage: 100 // Tous les films affichés sont vus
          }));
          
          // Debug: vérifier les IDs
          console.log('Personnalités chargées:', currentPersons.map(p => ({ name: p.name, id: p.id, type: p.type })));
          setPersons(currentPersons);
          
          // Petite pause entre les batches
          if (i + batchSize < filmsToProcess.length) {
            await new Promise(resolve => setTimeout(resolve, 200));
          }
        }
      } catch (error) {
        console.error('Erreur lors du chargement des personnalités:', error);
        setError(true);
      } finally {
        setLoading(false);
      }
    }
    
    loadPersons();
  }, []);

  // Filtrage et tri
  const filteredAndSortedPersons = useMemo(() => {
    let filtered = persons.filter(person => {
      const matchesSearch = person.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter = filterType === 'all' || person.type === filterType.slice(0, -1);
      return matchesSearch && matchesFilter;
    });

    filtered.sort((a, b) => {
      if (sortBy === 'mostViewed') {
        return b.watchedFilms - a.watchedFilms;
      } else {
        return a.name.localeCompare(b.name);
      }
    });

    return filtered;
  }, [persons, searchQuery, filterType, sortBy]);

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedPersons.length / PERSONS_PER_PAGE);
  const startIndex = (currentPage - 1) * PERSONS_PER_PAGE;
  const endIndex = startIndex + PERSONS_PER_PAGE;
  const currentPersons = filteredAndSortedPersons.slice(startIndex, endIndex);

  // Top personnalités
  const topPersons = useMemo(() => {
    return persons
      .sort((a, b) => b.watchedFilms - a.watchedFilms)
      .slice(0, 6);
  }, [persons]);

  if (loading) {
    return (
      <div className="min-h-screen py-8 pt-48">
        <div className="max-w-6xl mx-auto px-6">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-white mb-4 font-satoshi">🎭 Personnalités</h1>
            <p className="text-neutral-600">Chargement des personnalités...</p>
          </div>
          <FilmGridSkeleton count={12} />
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
            <h3 className="text-xl font-semibold text-white mb-2">
              Erreur de chargement
            </h3>
            <p className="text-neutral-600">
              Impossible de charger les personnalités. Veuillez réessayer.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 pt-48">
      <div className="max-w-6xl mx-auto px-6">
        {/* En-tête */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-4 font-satoshi">🎭 Personnalités</h1>
          <p className="text-neutral-200">
            Explorez les filmographies de vos acteurs et réalisateurs préférés ({persons.length} personnalités)
          </p>
        </div>

        {/* Top personnalités */}
        {topPersons.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-6">🏆 Top Personnalités</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              {topPersons.map((person) => (
                person.id && !isNaN(person.id) ? (
                  <Link key={`${person.type}-${person.id}`} href={`/${person.type}s/${person.id}`}>
                    <div className="bg-gray-800 rounded-xl shadow-lg border border-gray-700 overflow-hidden hover:shadow-xl hover:scale-105 transition-all duration-300 group">
                      <div className="relative aspect-square">
                        <ProfileImage
                          src={person.profile_path}
                          alt={person.name}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold text-sm truncate mb-1 text-white">{person.name}</h3>
                        <p className="text-xs text-gray-400 mb-2">
                          {person.watchedFilms} films vus
                        </p>
                        <ProgressBar value={person.watchedFilms} total={person.totalFilms} />
                      </div>
                    </div>
                  </Link>
                ) : null
              ))}
            </div>
          </div>
        )}

        {/* Outils : recherche + filtres + tri */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
          {/* Recherche */}
          <div className="relative flex-1">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher une personnalité..."
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-neutral-300 focus:ring-2 focus:ring-blue-500 outline-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          {/* Filtres */}
          <div className="flex gap-2">
            <button
              onClick={() => setFilterType('all')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                filterType === 'all' 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <FaFilter className="text-sm" />
              Tous
            </button>
            <button
              onClick={() => setFilterType('actors')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filterType === 'actors' 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Acteurs
            </button>
            <button
              onClick={() => setFilterType('directors')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filterType === 'directors' 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Réalisateurs
            </button>
          </div>
          
          {/* Tri */}
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

        {/* Liste des personnalités */}
        {currentPersons.length > 0 ? (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
              {currentPersons.map((person) => (
                person.id && !isNaN(person.id) ? (
                  <Link key={`${person.type}-${person.id}`} href={`/${person.type}s/${person.id}`}>
                    <div className="bg-gray-800 rounded-xl shadow-lg border border-gray-700 overflow-hidden hover:shadow-xl hover:scale-105 transition-all duration-300 group">
                      <div className="relative aspect-square">
                        <ProfileImage
                          src={person.profile_path}
                          alt={person.name}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold text-sm truncate mb-1 text-white">{person.name}</h3>
                        <p className="text-xs text-gray-400 mb-2">
                          {person.watchedFilms} films vus
                        </p>
                        <ProgressBar value={person.watchedFilms} total={person.totalFilms} />
                      </div>
                    </div>
                  </Link>
                ) : null
              ))}
            </div>

            {/* Pagination moderne */}
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              showResults={true}
              totalResults={filteredAndSortedPersons.length}
              resultsPerPage={PERSONS_PER_PAGE}
            />
          </>
        ) : (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🎭</div>
            <h3 className="text-xl font-semibold text-neutral-900 mb-2">
              Aucune personnalité trouvée
            </h3>
            <p className="text-neutral-600 mb-6">
              {searchQuery || filterType !== 'all' 
                ? 'Aucune personnalité ne correspond à vos critères.' 
                : 'Ajoutez des films à votre collection pour voir les personnalités apparaître ici.'
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
