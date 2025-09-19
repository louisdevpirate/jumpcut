'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import ProgressBar from "@/components/ProgressBar";
import Pagination from "@/components/Pagination";
import StarRatingModern from "@/components/StarRatingModern";
import { getFilms } from '@/lib/films-client';
import { FaSearch, FaSortAlphaDown, FaCalendarAlt, FaStar, FaArrowLeft } from 'react-icons/fa';

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
  biography: string;
  movie_credits: {
    cast: Array<{
      id: number;
      title: string;
      release_date: string;
      poster_path: string;
      vote_average: number;
    }>;
    crew: Array<{
      id: number;
      title: string;
      release_date: string;
      poster_path: string;
      vote_average: number;
      job: string;
    }>;
  };
}

const FILMS_PER_PAGE = 20;

export default function PersonDetailPage({ 
  params, 
  personType 
}: { 
  params: { id: string };
  personType: 'actors' | 'directors';
}) {
  const personId = parseInt(params.id);
  const [person, setPerson] = useState<Person | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [userFilms, setUserFilms] = useState<Film[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'year' | 'title' | 'popularity'>('year');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    async function fetchData() {
      try {
        // Simulation de données pour tester sans API TMDb
        const mockPerson: Person = {
          id: personId,
          name: personType === 'actors' ? 'Jean-Pierre Léaud' : 'François Truffaut',
          profile_path: '/placeholder-person.jpg',
          biography: 'Biographie de la personnalité...',
          movie_credits: {
            cast: [
              {
                id: 147,
                title: 'Les 400 Coups',
                release_date: '1959-05-04',
                poster_path: '/placeholder-poster.jpg',
                vote_average: 8.1
              },
              {
                id: 9459,
                title: 'Woodstock',
                release_date: '1970-08-26',
                poster_path: '/placeholder-poster.jpg',
                vote_average: 7.8
              }
            ],
            crew: [
              {
                id: 147,
                title: 'Les 400 Coups',
                release_date: '1959-05-04',
                poster_path: '/placeholder-poster.jpg',
                vote_average: 8.1,
                job: 'Director'
              }
            ]
          }
        };

        const filmsData = await getFilms();
        
        setPerson(mockPerson);
        setUserFilms(filmsData);
      } catch (error) {
        console.error('Erreur lors du chargement des détails:', error);
        setError(true);
      } finally {
        setLoading(false);
      }
    }
    
    fetchData();
  }, [personId, personType]);

  // Films vus de cette personnalité
  const watchedFilms = useMemo(() => {
    if (!person?.movie_credits?.cast && !person?.movie_credits?.crew) return [];
    
    const credits = personType === 'actors' 
      ? person.movie_credits?.cast || []
      : person.movie_credits?.crew?.filter((c: any) => c.job === 'Director') || [];
    
    return credits.filter((movie: any) => 
      userFilms.some(f => f.tmdbId === movie.id)
    );
  }, [person, userFilms, personType]);

  // Filmographie complète avec statut "vu"
  const filmography = useMemo(() => {
    if (!person?.movie_credits?.cast && !person?.movie_credits?.crew) return [];
    
    const credits = personType === 'actors' 
      ? person.movie_credits?.cast || []
      : person.movie_credits?.crew?.filter((c: any) => c.job === 'Director') || [];
    
    return credits.map((movie: any) => ({
      ...movie,
      isWatched: userFilms.some(f => f.tmdbId === movie.id),
      userRating: userFilms.find(f => f.tmdbId === movie.id)?.myRating || 0,
      userReview: userFilms.find(f => f.tmdbId === movie.id)?.myReview || ''
    }));
  }, [person, userFilms, personType]);

  // Filtrage et tri
  const filteredAndSortedMovies = useMemo(() => {
    let filtered = filmography.filter(movie =>
      movie.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    filtered.sort((a, b) => {
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
    });

    return filtered;
  }, [filmography, searchQuery, sortBy]);

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedMovies.length / FILMS_PER_PAGE);
  const startIndex = (currentPage - 1) * FILMS_PER_PAGE;
  const endIndex = startIndex + FILMS_PER_PAGE;
  const currentMovies = filteredAndSortedMovies.slice(startIndex, endIndex);

  // Statistiques
  const stats = useMemo(() => {
    const totalFilms = filmography.length;
    const watchedCount = watchedFilms.length;
    const completionPercentage = totalFilms > 0 ? (watchedCount / totalFilms) * 100 : 0;
    
    const averageRating = watchedFilms.length > 0 
      ? watchedFilms.reduce((sum, f) => sum + f.myRating, 0) / watchedFilms.length
      : 0;

    return {
      totalFilms,
      watchedCount,
      completionPercentage,
      averageRating: averageRating / 2 // Convertir de 10 à 5 étoiles
    };
  }, [filmography, watchedFilms]);

  if (loading) {
    return (
      <div className="min-h-screen py-8">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center py-16">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-neutral-600">Chargement des détails...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !person) {
    return (
      <div className="min-h-screen py-8">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center py-16">
            <div className="text-6xl mb-4">⚠️</div>
            <h1 className="text-2xl font-bold text-neutral-900 mb-4">
              Personnalité non trouvée
            </h1>
            <p className="text-neutral-600 mb-6">
              Cette personnalité n'existe pas ou n'est plus disponible.
            </p>
            <Link 
              href="/personalities"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              <FaArrowLeft className="text-sm" />
              Retour aux personnalités
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-6xl mx-auto px-6">
        {/* Bouton retour */}
        <div className="mb-6">
          <Link 
            href="/personalities"
            className="inline-flex items-center gap-2 text-blue-500 hover:text-blue-600 transition-colors"
          >
            <FaArrowLeft className="text-sm" />
            Retour aux personnalités
          </Link>
        </div>

        {/* En-tête de la personnalité */}
        <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-8 mb-8">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Photo */}
            <div className="flex-shrink-0">
              <div className="relative w-48 h-48 rounded-xl overflow-hidden">
                <Image
                  src={person.profile_path ? `https://image.tmdb.org/t/p/w500${person.profile_path}` : '/placeholder-person.jpg'}
                  alt={person.name}
                  fill
                  className="object-cover"
                  loading="lazy"
                />
              </div>
            </div>
            
            {/* Informations */}
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-neutral-900 mb-4 font-satoshi">
                {person.name}
              </h1>
              
              {/* Biographie */}
              {person.biography && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-neutral-900 mb-3">Biographie</h3>
                  <p className="text-neutral-700 leading-relaxed line-clamp-4">
                    {person.biography}
                  </p>
                </div>
              )}

              {/* Statistiques */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{stats.totalFilms}</div>
                  <div className="text-sm text-blue-700">Films total</div>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{stats.watchedCount}</div>
                  <div className="text-sm text-green-700">Films vus</div>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">
                    {stats.completionPercentage.toFixed(0)}%
                  </div>
                  <div className="text-sm text-purple-700">Complétion</div>
                </div>
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-600">
                    {stats.averageRating.toFixed(1)}
                  </div>
                  <div className="text-sm text-yellow-700">Note moyenne</div>
                </div>
              </div>

              {/* Barre de progression */}
              <div className="mt-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-neutral-700">Progression de la filmographie</span>
                  <span className="text-sm text-neutral-500">
                    {stats.watchedCount}/{stats.totalFilms} films
                  </span>
                </div>
                <ProgressBar value={stats.watchedCount} total={stats.totalFilms} />
              </div>
            </div>
          </div>
        </div>

        {/* Outils de recherche et tri */}
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
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-neutral-900 mb-6 font-satoshi">
            Filmographie complète
          </h2>
          
          {currentMovies.length > 0 ? (
            <>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {currentMovies.map((movie) => (
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
                        {movie.isWatched && (
                          <span className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded font-medium">
                            ✅ Vu
                          </span>
                        )}
                      </div>
                      <div className="p-3">
                        <h3 className="font-semibold text-sm truncate mb-1">{movie.title}</h3>
                        <p className="text-xs text-neutral-500 mb-2">
                          {movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A'}
                        </p>
                        
                        {/* Note TMDb */}
                        <div className="flex items-center gap-1 text-xs text-neutral-400 mb-2">
                          <FaStar className="text-yellow-400" />
                          <span>{movie.vote_average?.toFixed(1)}/10</span>
                        </div>

                        {/* Note personnelle si disponible */}
                        {movie.isWatched && movie.userRating > 0 && (
                          <div className="mb-2">
                            <StarRatingModern 
                              rating={movie.userRating / 2} 
                              interactive={false} 
                              size="sm" 
                            />
                          </div>
                        )}

                        {/* Critique rapide si disponible */}
                        {movie.isWatched && movie.userReview && (
                          <p className="text-xs text-neutral-600 line-clamp-2">
                            "{movie.userReview}"
                          </p>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Pagination */}
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
                {searchQuery ? 'Aucun film ne correspond à votre recherche.' : 'Aucun film disponible pour cette personnalité.'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}