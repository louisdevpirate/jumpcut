'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import ProgressBar from "@/components/ProgressBar";
import Pagination from "@/components/Pagination";
import { getFilms } from '@/lib/films-client';
import { getActorDetails } from "@/lib/tmdb";
import { FaSearch, FaSortAlphaDown, FaCalendarAlt, FaStar } from 'react-icons/fa';

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

interface ActorDetail {
  id: number;
  name: string;
  profile_path: string;
  biography: string;
  birthday: string;
  place_of_birth: string;
  known_for_department: string;
  movie_credits: {
    cast: Array<{
      id: number;
      title: string;
      release_date: string;
      poster_path: string;
      vote_average: number;
    }>;
  };
}

const FILMS_PER_PAGE = 20;

export default function ActorDetailPage({ params }: { params: { id: string } }) {
  const [actor, setActor] = useState<ActorDetail | null>(null);
  const [watchedFilms, setWatchedFilms] = useState<Film[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'year' | 'title' | 'popularity'>('year');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    async function loadActorDetails() {
      try {
        const actorId = parseInt(params.id);
        const [actorData, films] = await Promise.all([
          getActorDetails(actorId),
          getFilms()
        ]);

        if (actorData) {
          setActor(actorData);
          
          // Filtrer les films vus de cet acteur
          const watchedFilmsForActor = films.filter(film => {
            // Pour l'instant, on ne peut pas facilement matcher les films vus avec la filmographie complète
            // Cette logique devrait être améliorée avec une meilleure correspondance
            return film.tmdbId && actorData.movie_credits?.cast?.some((movie: any) => movie.id === film.tmdbId);
          });
          
          setWatchedFilms(watchedFilmsForActor);
        } else {
          setError(true);
        }
      } catch (error) {
        console.error('Erreur lors du chargement des détails de l\'acteur:', error);
        setError(true);
      } finally {
        setLoading(false);
      }
    }
    
    loadActorDetails();
  }, [params.id]);

  // Filtrage et tri de la filmographie
  const filteredAndSortedMovies = actor?.movie_credits?.cast?.filter(movie =>
    movie.title.toLowerCase().includes(searchQuery.toLowerCase())
  ).sort((a, b) => {
    switch (sortBy) {
      case 'year':
        return new Date(b.release_date || '').getTime() - new Date(a.release_date || '').getTime();
      case 'title':
        return a.title.localeCompare(b.title);
      case 'popularity':
        return b.vote_average - a.vote_average;
      default:
        return 0;
    }
  }) || [];

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedMovies.length / FILMS_PER_PAGE);
  const startIndex = (currentPage - 1) * FILMS_PER_PAGE;
  const endIndex = startIndex + FILMS_PER_PAGE;
  const currentMovies = filteredAndSortedMovies.slice(startIndex, endIndex);

  // Calcul des statistiques
  const totalMovies = actor?.movie_credits?.cast?.length || 0;
  const watchedCount = watchedFilms.length;
  const completionPercentage = totalMovies > 0 ? (watchedCount / totalMovies) * 100 : 0;

  if (loading) {
    return (
      <div className="min-h-screen py-8">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row gap-8 items-start mb-12">
            <div className="w-40 h-40 bg-gray-200 rounded-xl animate-pulse"></div>
            <div className="flex-1">
              <div className="h-8 bg-gray-200 rounded animate-pulse mb-4 w-1/2"></div>
              <div className="h-4 bg-gray-200 rounded animate-pulse mb-2 w-1/3"></div>
              <div className="h-4 bg-gray-200 rounded animate-pulse mb-4 w-1/4"></div>
              <div className="h-20 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !actor) {
    return (
      <div className="min-h-screen py-8">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center py-16">
            <div className="text-6xl mb-4">⚠️</div>
            <h3 className="text-xl font-semibold text-neutral-900 mb-2">
              Acteur non trouvé
            </h3>
            <p className="text-neutral-600">
              Impossible de charger les détails de cet acteur.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header acteur */}
        <div className="flex flex-col md:flex-row gap-8 items-start mb-12">
          <div className="relative w-40 h-40 rounded-xl overflow-hidden shadow-lg">
            <Image
              src={actor.profile_path ? `https://image.tmdb.org/t/p/w300${actor.profile_path}` : '/placeholder-actor.jpg'}
              alt={actor.name}
              fill
              className="object-cover"
              loading="lazy"
            />
          </div>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-neutral-900 mb-2">{actor.name}</h1>
            {actor.birthday && (
              <p className="text-neutral-600 text-sm mb-1">
                Né le {new Date(actor.birthday).toLocaleDateString('fr-FR')}
                {actor.place_of_birth && ` à ${actor.place_of_birth}`}
              </p>
            )}
            {actor.known_for_department && (
              <p className="text-neutral-500 text-sm mb-4">
                {actor.known_for_department}
              </p>
            )}
            {actor.biography && (
              <p className="text-neutral-700 max-w-2xl leading-relaxed">
                {actor.biography.length > 300 
                  ? `${actor.biography.substring(0, 300)}...` 
                  : actor.biography
                }
              </p>
            )}
            <div className="mt-6">
              <p className="text-sm text-neutral-600 mb-2">
                Filmographie complétée : {watchedCount}/{totalMovies} films ({completionPercentage.toFixed(1)}%)
              </p>
              <ProgressBar value={watchedCount} total={totalMovies} />
            </div>
          </div>
        </div>

        {/* Outils : recherche + tri */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div className="relative flex-1">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher dans la filmographie..."
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-neutral-300 focus:ring-2 focus:ring-blue-500 outline-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="relative">
            <select
              className="block w-full pl-3 pr-10 py-2 rounded-lg border border-neutral-300 appearance-none focus:ring-2 focus:ring-blue-500 outline-none"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'year' | 'title' | 'popularity')}
            >
              <option value="year">Par année</option>
              <option value="title">Par titre</option>
              <option value="popularity">Par popularité</option>
            </select>
            <FaSortAlphaDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {/* Filmographie */}
        <h2 className="text-2xl font-bold text-neutral-900 mb-6">
          Filmographie ({totalMovies} films)
        </h2>
        
        {currentMovies.length > 0 ? (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {currentMovies.map((movie) => {
                const isWatched = watchedFilms.some(f => f.tmdbId === movie.id);
                return (
                  <Link key={movie.id} href={`/films/${movie.id}`}>
                    <div className="bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden hover:shadow-lg transition relative">
                      <div className="relative aspect-[2/3]">
                        <Image
                          src={movie.poster_path ? `https://image.tmdb.org/t/p/w300${movie.poster_path}` : '/placeholder-poster.svg'}
                          alt={movie.title}
                          fill
                          className="object-cover"
                          loading="lazy"
                        />
                        {isWatched && (
                          <span className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded font-medium">
                            ✅ Vu
                          </span>
                        )}
                      </div>
                      <div className="p-3">
                        <h3 className="font-semibold text-sm truncate mb-1">{movie.title}</h3>
                        <p className="text-xs text-neutral-500 mb-1">
                          {movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A'}
                        </p>
                        <div className="flex items-center gap-1 text-xs text-neutral-400">
                          <FaStar className="text-yellow-400" />
                          <span>{movie.vote_average.toFixed(1)}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>

            {/* Pagination moderne */}
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              showResults={true}
              totalResults={filteredAndSortedMovies.length}
              resultsPerPage={FILMS_PER_PAGE}
            />
          </>
        ) : (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🎬</div>
            <h3 className="text-xl font-semibold text-neutral-900 mb-2">
              Aucun film trouvé
            </h3>
            <p className="text-neutral-600">
              {searchQuery ? 'Aucun film ne correspond à votre recherche.' : 'Aucune filmographie disponible.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
