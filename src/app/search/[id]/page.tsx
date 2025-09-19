'use client';

import { getMovieDetails } from "@/lib/tmdb";
import FilmCard from "@/components/FilmCard";
import WatchedButton from "@/components/WatchedButton";
import ReviewForm from "@/components/ReviewForm";
import { useState, useEffect } from "react";

interface SearchPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function SearchPage({ params }: SearchPageProps) {
  const [movieDetails, setMovieDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [movieId, setMovieId] = useState<number | null>(null);

  useEffect(() => {
    const fetchParams = async () => {
      const { id } = await params;
      const idNum = parseInt(id);
      setMovieId(idNum);
      
      try {
        const details = await getMovieDetails(idNum);
        setMovieDetails(details);
      } catch (error) {
        console.error('Erreur lors du chargement du film:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchParams();
  }, [params]);

  const handleAddToCollection = () => {
    setShowReviewForm(true);
  };

  const handleSubmitReview = async (reviewData: any) => {
    // TODO: Implémenter l'ajout à la collection
    console.log('Ajout du film à la collection:', { movieId, ...reviewData });
    setShowReviewForm(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen py-8">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center py-16">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-neutral-600">Chargement du film...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!movieDetails) {
    return (
      <div className="min-h-screen py-8">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <h1 className="text-2xl font-bold text-neutral-900 mb-4">
              Film non trouvé
            </h1>
            <p className="text-neutral-600">
              Le film que vous recherchez n'existe pas ou n'est plus disponible.
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
          <h1 className="text-4xl font-bold text-neutral-900 mb-4">
            Résultat de recherche
          </h1>
          <p className="text-neutral-600">
            Film trouvé : {movieDetails.title}
          </p>
        </div>

        {/* Informations du film */}
        <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-shrink-0">
              <div className="relative w-48 h-72 rounded-lg overflow-hidden">
                <img
                  src={movieDetails.poster_path ? `https://image.tmdb.org/t/p/w500${movieDetails.poster_path}` : '/placeholder-poster.jpg'}
                  alt={movieDetails.title}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            
            <div className="flex-1">
              <h2 className="text-3xl font-bold text-neutral-900 mb-2">
                {movieDetails.title}
              </h2>
              <p className="text-xl text-neutral-600 mb-4">
                {new Date(movieDetails.release_date).getFullYear()}
              </p>
              
              {movieDetails.genres && movieDetails.genres.length > 0 && (
                <div className="mb-4">
                  <span className="text-sm font-medium text-neutral-700">Genres : </span>
                  <span className="text-neutral-900">
                    {movieDetails.genres.map(g => g.name).join(', ')}
                  </span>
                </div>
              )}
              
              {movieDetails.overview && (
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-neutral-900 mb-2">Synopsis</h3>
                  <p className="text-neutral-700 leading-relaxed">{movieDetails.overview}</p>
                </div>
              )}

              <div className="flex gap-4">
                <button 
                  onClick={handleAddToCollection}
                  className="btn-primary px-6 py-3 text-white font-medium rounded-lg"
                >
                  Ajouter à ma collection
                </button>
                <button className="px-6 py-3 border border-neutral-300 text-neutral-700 font-medium rounded-lg hover:bg-neutral-50 transition">
                  Voir plus d'infos
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Formulaire d'ajout à la collection */}
        {showReviewForm && (
          <div className="mt-8">
            <ReviewForm
              onSubmit={handleSubmitReview}
              onCancel={() => setShowReviewForm(false)}
              isEditing={false}
            />
          </div>
        )}
      </div>
    </div>
  );
}
