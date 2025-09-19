'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import StarRating from './StarRating';

interface FilmCardProps {
  id: number;
  title: string;
  year: number | null;
  tmdbId: number | null;
  myRating: number;
}

export default function FilmCard({ id, title, year, tmdbId, myRating }: FilmCardProps) {
  const [poster, setPoster] = useState<string>('/placeholder-poster.svg');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadPoster = async () => {
      if (!tmdbId) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/tmdb/movie/${tmdbId}`);
        if (response.ok) {
          const data = await response.json();
          if (data.poster_path) {
            setPoster(`https://image.tmdb.org/t/p/w500${data.poster_path}`);
          }
        }
      } catch (error) {
        console.warn(`Erreur lors du chargement de l'affiche pour ${title}:`, error);
      } finally {
        setIsLoading(false);
      }
    };

    loadPoster();
  }, [tmdbId, title]);

  return (
    <Link href={`/films/${id}`} className="group block">
      <div className="film-card rounded-xl overflow-hidden shadow-md bg-white hover:shadow-xl transition duration-300 animate-fade-in">
        <div className="relative aspect-[2/3]">
          {isLoading ? (
            <div className="w-full h-full bg-neutral-200 animate-pulse flex items-center justify-center">
              <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <Image
              src={poster}
              alt={title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          )}
        </div>
        <div className="p-4">
          <h3 className="font-semibold text-lg text-neutral-900 truncate">{title}</h3>
          <p className="text-sm text-neutral-500">{year || 'Année inconnue'}</p>
          <div className="mt-2">
            <StarRating rating={Math.round(myRating / 2)} interactive={false} size="sm" />
          </div>
        </div>
      </div>
    </Link>
  );
}
