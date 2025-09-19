'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import StarRating from './StarRating';

interface FilmCardClientProps {
  id: number;
  title: string;
  year: number | null;
  tmdbId: number | null;
  myRating: number;
}

export default function FilmCardClient({ id, title, year, tmdbId, myRating }: FilmCardClientProps) {
  const [posterUrl, setPosterUrl] = useState('/placeholder-poster.svg');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPoster() {
      if (tmdbId) {
        try {
          const response = await fetch(`/api/tmdb/movie/${tmdbId}`);
          if (response.ok) {
            const data = await response.json();
            if (data.poster_path) {
              setPosterUrl(`https://image.tmdb.org/t/p/w300${data.poster_path}`);
            }
          }
        } catch (error) {
          console.error(`Erreur lors du chargement de l'affiche pour ${title}:`, error);
        }
      }
      setLoading(false);
    }
    
    fetchPoster();
  }, [tmdbId, title]);

  return (
    <Link href={`/films/${id}`}>
      <div className="film-card bg-gray-800 rounded-lg overflow-hidden hover:bg-gray-700 transition">
        <div className="relative aspect-[2/3]">
          {loading ? (
            <div className="w-full h-full bg-gray-700 flex items-center justify-center">
              <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <Image
              src={posterUrl}
              alt={title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw"
              loading="lazy"
              placeholder="blur"
              blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
            />
          )}
        </div>
        <div className="p-3">
          <h3 className="font-semibold text-sm text-white truncate mb-1">
            {title}
          </h3>
          <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
            <span>{year || 'N/A'}</span>
            {myRating > 0 && (
              <span>⭐ {myRating}/10</span>
            )}
          </div>
          {myRating > 0 && (
            <StarRating rating={Math.round(myRating / 2)} interactive={false} size="sm" />
          )}
        </div>
      </div>
    </Link>
  );
}