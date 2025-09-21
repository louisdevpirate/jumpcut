'use client';

import { useState, useEffect } from 'react';

export type Rating5 = 0 | 0.5 | 1 | 1.5 | 2 | 2.5 | 3 | 3.5 | 4 | 4.5 | 5;

export interface FilmLocal {
  tmdbId: number;
  title: string;
  year: number;
  posterUrl?: string;
  dateWatched?: string;
  rating5?: Rating5;
  quickReview140?: string;
  createdAt?: string;
  updatedAt?: string;
  overrides?: {
    posterUrl?: string | null;
    title?: string | null;
    year?: number | null;
  };
}

export interface QuickReviewData {
  rating: Rating5;
  review: string;
  tmdbId: number;
}

export interface FilmsResponse {
  films: FilmLocal[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Hook pour gérer les films
export function useFilms() {
  const [films, setFilms] = useState<FilmLocal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFilms = async (page = 1, limit = 50, sort = 'dateWatched', q = '') => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        sort,
        q
      });

      const response = await fetch(`/api/my/films?${params}`);
      if (!response.ok) {
        throw new Error('Erreur lors du chargement des films');
      }

      const data: FilmsResponse = await response.json();
      setFilms(data.films);
      setError(null);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const addQuickReview = async (data: QuickReviewData & { title?: string; year?: number; posterUrl?: string }) => {
    try {
      const response = await fetch('/api/my/films', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur lors de la sauvegarde');
      }

      const result = await response.json();
      
      // Mettre à jour la liste locale
      setFilms(prevFilms => {
        const existingIndex = prevFilms.findIndex(f => f.tmdbId === data.tmdbId);
        if (existingIndex >= 0) {
          const updated = [...prevFilms];
          updated[existingIndex] = result.film;
          return updated;
        } else {
          return [result.film, ...prevFilms];
        }
      });

      return result.film;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la sauvegarde');
      throw err;
    }
  };

  const getFilmByTmdbId = (tmdbId: number): FilmLocal | undefined => {
    return films.find(f => f.tmdbId === tmdbId);
  };

  const isFilmWatched = (tmdbId: number): boolean => {
    return films.some(f => f.tmdbId === tmdbId);
  };

  useEffect(() => {
    fetchFilms();
  }, []);

  return {
    films,
    loading,
    error,
    fetchFilms,
    addQuickReview,
    getFilmByTmdbId,
    isFilmWatched,
    refetch: () => fetchFilms()
  };
}

// Hook pour la critique rapide
export function useQuickReview() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMovie, setCurrentMovie] = useState<{
    tmdbId: number;
    title: string;
    year?: number;
    posterUrl?: string;
  } | null>(null);

  const openQuickReview = (movie: {
    tmdbId: number;
    title: string;
    year?: number;
    posterUrl?: string;
  }) => {
    setCurrentMovie(movie);
    setIsOpen(true);
  };

  const closeQuickReview = () => {
    setIsOpen(false);
    setCurrentMovie(null);
  };

  return {
    isOpen,
    currentMovie,
    openQuickReview,
    closeQuickReview
  };
}
