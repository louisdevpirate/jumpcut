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

interface Actor {
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

const ACTORS_PER_PAGE = 20;

export default function ActorsPage() {
  const [actors, setActors] = useState<Actor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'mostViewed' | 'alphabetical'>('mostViewed');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    async function loadActors() {
      try {
        const films = await getFilms();
        const actorsMap = new Map();
        
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
              if (tmdbData?.credits?.cast) {
                // Prendre seulement les 3 premiers acteurs pour éviter trop de données
                tmdbData.credits.cast.slice(0, 3).forEach(actor => {
                  if (!actorsMap.has(actor.id)) {
                    actorsMap.set(actor.id, {
                      id: actor.id,
                      name: actor.name,
                      profile_path: actor.profile_path,
                      films: [],
                      totalFilms: 0,
                      watchedFilms: 0,
                      completionPercentage: 0
                    });
                  }
                  actorsMap.get(actor.id).films.push({
                    id: film.id,
                    title: film.title,
                    year: film.year,
                    watched: true
                  });
                });
              }
            } catch (error) {
              console.error(`Erreur pour ${film.title}:`, error);
            }
          }));
          
          // Mettre à jour l'état progressivement
          const currentActors = Array.from(actorsMap.values()).map(actor => ({
            ...actor,
            watchedFilms: actor.films.length,
            totalFilms: actor.films.length, // Pour l'instant, on ne récupère que les films vus
            completionPercentage: 100 // Tous les films affichés sont vus
          }));
          setActors(currentActors);
          
          // Petite pause entre les batches
          if (i + batchSize < filmsWithTmdbId.length) {
            await new Promise(resolve => setTimeout(resolve, 100));
          }
        }
      } catch (error) {
        console.error('Erreur lors du chargement des acteurs:', error);
        setError(true);
      } finally {
        setLoading(false);
      }
    }
    
    loadActors();
  }, []);

  // Filtrage et tri
  const filteredAndSortedActors = useMemo(() => {
    let filtered = actors.filter(actor =>
      actor.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    filtered.sort((a, b) => {
      if (sortBy === 'mostViewed') {
        return b.watchedFilms - a.watchedFilms;
      } else {
        return a.name.localeCompare(b.name);
      }
    });

    return filtered;
  }, [actors, searchQuery, sortBy]);

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedActors.length / ACTORS_PER_PAGE);
  const startIndex = (currentPage - 1) * ACTORS_PER_PAGE;
  const endIndex = startIndex + ACTORS_PER_PAGE;
  const currentActors = filteredAndSortedActors.slice(startIndex, endIndex);

  // Top 5 acteurs
  const topActors = useMemo(() => {
    return actors
      .sort((a, b) => b.watchedFilms - a.watchedFilms)
      .slice(0, 5);
  }, [actors]);

  if (loading) {
    return (
      <div className="min-h-screen py-8">
        <div className="max-w-6xl mx-auto px-6">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-neutral-900 mb-4 font-satoshi">🎭 Acteurs</h1>
            <p className="text-neutral-600">Chargement des acteurs...</p>
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
              Impossible de charger les acteurs. Veuillez réessayer.
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
          <h1 className="text-4xl font-bold text-neutral-900 mb-4 font-satoshi">🎭 Acteurs</h1>
          <p className="text-neutral-600">
            Explorez les filmographies de vos acteurs préférés ({actors.length} acteurs)
          </p>
        </div>

        {/* Top 5 acteurs */}
        {topActors.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-neutral-900 mb-6">🏆 Top Acteurs</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
              {topActors.map((actor) => (
                <Link key={actor.id} href={`/actors/${actor.id}`}>
                  <div className="bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden hover:shadow-lg transition">
                    <div className="relative aspect-square">
                      <Image
                        src={actor.profile_path ? `https://image.tmdb.org/t/p/w185${actor.profile_path}` : '/placeholder-actor.jpg'}
                        alt={actor.name}
                        fill
                        className="object-cover"
                        loading="lazy"
                      />
                    </div>
                    <div className="p-3">
                      <h3 className="font-semibold text-sm truncate mb-1">{actor.name}</h3>
                      <p className="text-xs text-neutral-500 mb-2">{actor.watchedFilms} films vus</p>
                      <ProgressBar value={actor.watchedFilms} total={actor.totalFilms} />
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
              placeholder="Rechercher un acteur..."
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

        {/* Liste des acteurs */}
        {currentActors.length > 0 ? (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {currentActors.map((actor) => (
                <Link key={actor.id} href={`/actors/${actor.id}`}>
                  <div className="bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden hover:shadow-lg transition">
                    <div className="relative aspect-square">
                      <Image
                        src={actor.profile_path ? `https://image.tmdb.org/t/p/w185${actor.profile_path}` : '/placeholder-actor.jpg'}
                        alt={actor.name}
                        fill
                        className="object-cover"
                        loading="lazy"
                      />
                    </div>
                    <div className="p-3">
                      <h3 className="font-semibold text-sm truncate mb-1">{actor.name}</h3>
                      <p className="text-xs text-neutral-500 mb-2">{actor.watchedFilms} films vus</p>
                      <ProgressBar value={actor.watchedFilms} total={actor.totalFilms} />
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
              totalResults={filteredAndSortedActors.length}
              resultsPerPage={ACTORS_PER_PAGE}
            />
          </>
        ) : (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🎭</div>
            <h3 className="text-xl font-semibold text-neutral-900 mb-2">
              Aucun acteur trouvé
            </h3>
            <p className="text-neutral-600 mb-6">
              {searchQuery ? 'Aucun acteur ne correspond à votre recherche.' : 'Ajoutez des films à votre collection pour voir les acteurs apparaître ici.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
