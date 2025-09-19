'use client';

import Image from "next/image";
import { useState } from "react";
import StarRating from "./StarRating";
import WatchedButton from "./WatchedButton";
import ReviewForm from "./ReviewForm";

interface FilmDetailProps {
  film: {
    id: number;
    tmdbId: number;
    title: string;
    year: number;
    myRating: number;
    positives: string;
    negatives: string;
    myReview: string;
    dateWatched: string;
  };
  tmdbData?: {
    poster_path: string;
    overview: string;
    genres: Array<{ name: string }>;
    director?: string;
    cast?: Array<{ name: string }>;
  };
  onToggleWatched?: (isWatched: boolean) => void;
  onUpdateReview?: (reviewData: any) => void;
}

export default function FilmDetail({ film, tmdbData, onToggleWatched, onUpdateReview }: FilmDetailProps) {
  const [isEditingReview, setIsEditingReview] = useState(false);

  const handleToggleWatched = async (isWatched: boolean) => {
    if (onToggleWatched) {
      await onToggleWatched(isWatched);
    }
  };

  const handleUpdateReview = async (reviewData: any) => {
    if (onUpdateReview) {
      await onUpdateReview(reviewData);
      setIsEditingReview(false);
    }
  };
  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      {/* En-tête du film */}
      <div className="flex flex-col lg:flex-row gap-8 mb-8">
        <div className="flex-shrink-0">
          <div className="relative w-80 h-[480px] rounded-xl overflow-hidden shadow-lg">
            <Image
              src={tmdbData?.poster_path ? `https://image.tmdb.org/t/p/w500${tmdbData.poster_path}` : '/placeholder-poster.jpg'}
              alt={film.title}
              fill
              className="object-cover"
            />
          </div>
        </div>
        
        <div className="flex-1">
          <h1 className="text-4xl font-bold text-neutral-900 mb-2">{film.title}</h1>
          <p className="text-xl text-neutral-600 mb-4">{film.year}</p>
          
          {/* Note personnelle */}
          <div className="flex items-center gap-4 mb-6">
            <span className="text-sm font-medium text-neutral-700">Ma note :</span>
            <StarRating 
              rating={film.myRating} 
              interactive={true}
              size="lg"
              onRatingChange={(rating) => {
                // TODO: Implémenter la mise à jour de la note
                console.log('Nouvelle note:', rating);
              }}
            />
          </div>

          {/* Bouton Vu */}
          <div className="mb-6">
            <WatchedButton 
              isWatched={true} // Pour l'instant, considérons tous les films comme vus
              onToggle={handleToggleWatched}
              movieId={film.id}
            />
          </div>

          {/* Informations TMDb */}
          {tmdbData && (
            <div className="space-y-4 mb-6">
              {tmdbData.director && (
                <div>
                  <span className="text-sm font-medium text-neutral-700">Réalisateur : </span>
                  <span className="text-neutral-900">{tmdbData.director}</span>
                </div>
              )}
              
              {tmdbData.genres && tmdbData.genres.length > 0 && (
                <div>
                  <span className="text-sm font-medium text-neutral-700">Genres : </span>
                  <span className="text-neutral-900">{tmdbData.genres.map(g => g.name).join(', ')}</span>
                </div>
              )}
              
              {tmdbData.cast && tmdbData.cast.length > 0 && (
                <div>
                  <span className="text-sm font-medium text-neutral-700">Acteurs principaux : </span>
                  <span className="text-neutral-900">{tmdbData.cast.slice(0, 3).map(a => a.name).join(', ')}</span>
                </div>
              )}
            </div>
          )}

          <div className="text-sm text-neutral-500">
            Vu le {new Date(film.dateWatched).toLocaleDateString('fr-FR')}
          </div>
        </div>
      </div>

      {/* Synopsis */}
      {tmdbData?.overview && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-neutral-900 mb-4">Synopsis</h2>
          <p className="text-neutral-700 leading-relaxed">{tmdbData.overview}</p>
        </div>
      )}

      {/* Critique personnelle */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-neutral-900">Ma critique</h2>
          <button
            onClick={() => setIsEditingReview(!isEditingReview)}
            className="px-4 py-2 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 transition"
          >
            {isEditingReview ? 'Annuler' : 'Modifier'}
          </button>
        </div>

        {isEditingReview ? (
          <ReviewForm
            initialData={{
              rating: film.myRating,
              positives: film.positives,
              negatives: film.negatives,
              review: film.myReview,
              dateWatched: film.dateWatched
            }}
            onSubmit={handleUpdateReview}
            onCancel={() => setIsEditingReview(false)}
            isEditing={true}
          />
        ) : (
          <div className="space-y-6">
            {/* Points positifs et négatifs */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="critique-positive rounded-lg p-6 animate-slide-in">
                <h3 className="text-lg font-semibold text-green-800 mb-3">Points positifs</h3>
                <p className="text-green-700">{film.positives || 'Aucun point positif renseigné'}</p>
              </div>
              
              <div className="critique-negative rounded-lg p-6 animate-slide-in" style={{ animationDelay: '0.1s' }}>
                <h3 className="text-lg font-semibold text-red-800 mb-3">Points négatifs</h3>
                <p className="text-red-700">{film.negatives || 'Aucun point négatif renseigné'}</p>
              </div>
            </div>

            {/* Critique complète */}
            <div className="bg-white border border-neutral-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-neutral-900 mb-3">Critique complète</h3>
              <p className="text-neutral-700 leading-relaxed">{film.myReview || 'Aucune critique renseignée'}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
