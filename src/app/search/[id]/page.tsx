'use client';

import { getMovieDetails } from "@/lib/tmdb";
import FilmCard from "@/components/FilmCard";
import WatchedButton from "@/components/WatchedButton";
import ReviewForm from "@/components/ReviewForm";
import { useState, useEffect } from "react";
import Link from "next/link";

interface SearchPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function SearchPage({ params }: SearchPageProps) {
  const [movieDetails, setMovieDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [showMoreInfo, setShowMoreInfo] = useState(false);
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

  const handleQuickAdd = async () => {
    try {
      const response = await fetch('/api/films', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tmdbId: movieId,
          title: movieDetails.title,
          year: new Date(movieDetails.release_date).getFullYear(),
          myRating: 0,
          positives: '',
          negatives: '',
          myReview: '',
          dateWatched: new Date().toISOString().split('T')[0]
        }),
      });

      if (response.ok) {
        alert('Film ajouté à votre collection ! Vous pourrez le noter plus tard.');
      } else {
        alert('Erreur lors de l\'ajout du film. Veuillez réessayer.');
      }
    } catch (error) {
      console.error('Erreur lors de l\'ajout rapide:', error);
      alert('Erreur lors de l\'ajout du film. Veuillez réessayer.');
    }
  };

  const handleAddToCollection = () => {
    setShowReviewForm(true);
  };

  const handleSubmitReview = async (reviewData: any) => {
    try {
      // Appel à l'API pour ajouter le film à la collection
      const response = await fetch('/api/films', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tmdbId: movieId,
          title: movieDetails.title,
          year: new Date(movieDetails.release_date).getFullYear(),
          myRating: reviewData.rating * 2, // Convertir de 5 étoiles à 10
          positives: reviewData.positives,
          negatives: reviewData.negatives,
          myReview: reviewData.review,
          dateWatched: new Date().toISOString().split('T')[0]
        }),
      });

      if (response.ok) {
        console.log('Film ajouté à la collection avec succès !');
        setShowReviewForm(false);
        // Optionnel : afficher un message de succès
        alert('Film ajouté à votre collection !');
      } else {
        console.error('Erreur lors de l\'ajout du film');
        alert('Erreur lors de l\'ajout du film. Veuillez réessayer.');
      }
    } catch (error) {
      console.error('Erreur lors de l\'ajout du film:', error);
      alert('Erreur lors de l\'ajout du film. Veuillez réessayer.');
    }
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

              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex flex-col sm:flex-row gap-2">
                  <button 
                    onClick={handleAddToCollection}
                    className="btn-primary px-6 py-3 text-white font-medium rounded-lg"
                  >
                    ✨ J'ai vu ce film - Noter & Critiquer
                  </button>
                  <button 
                    onClick={handleQuickAdd}
                    className="px-6 py-3 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition"
                  >
                    📝 Ajouter rapidement
                  </button>
                </div>
                <button 
                  onClick={() => setShowMoreInfo(!showMoreInfo)}
                  className="px-6 py-3 border border-neutral-300 text-neutral-700 font-medium rounded-lg hover:bg-neutral-50 transition"
                >
                  {showMoreInfo ? 'Masquer les détails' : 'Voir plus d\'infos'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Informations détaillées */}
        {showMoreInfo && movieDetails && (
          <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6 mb-8">
            <h3 className="text-2xl font-bold text-neutral-900 mb-6">Informations détaillées</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Informations de base */}
              <div>
                <h4 className="text-lg font-semibold text-neutral-900 mb-4">Informations générales</h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Titre original :</span>
                    <span className="text-neutral-900 font-medium">{movieDetails.original_title}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Langue originale :</span>
                    <span className="text-neutral-900 font-medium">{movieDetails.original_language?.toUpperCase()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Note TMDb :</span>
                    <span className="text-neutral-900 font-medium">⭐ {movieDetails.vote_average?.toFixed(1)}/10</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Nombre de votes :</span>
                    <span className="text-neutral-900 font-medium">{movieDetails.vote_count?.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Statut :</span>
                    <span className="text-neutral-900 font-medium">{movieDetails.status}</span>
                  </div>
                </div>
              </div>

              {/* Informations techniques */}
              <div>
                <h4 className="text-lg font-semibold text-neutral-900 mb-4">Informations techniques</h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Durée :</span>
                    <span className="text-neutral-900 font-medium">{movieDetails.runtime ? `${movieDetails.runtime} min` : 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Budget :</span>
                    <span className="text-neutral-900 font-medium">
                      {movieDetails.budget ? `$${movieDetails.budget.toLocaleString()}` : 'N/A'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Recettes :</span>
                    <span className="text-neutral-900 font-medium">
                      {movieDetails.revenue ? `$${movieDetails.revenue.toLocaleString()}` : 'N/A'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Sociétés de production :</span>
                    <span className="text-neutral-900 font-medium">
                      {movieDetails.production_companies?.length > 0 
                        ? movieDetails.production_companies.map(c => c.name).join(', ')
                        : 'N/A'
                      }
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Genres et mots-clés */}
            {movieDetails.genres && movieDetails.genres.length > 0 && (
              <div className="mt-6">
                <h4 className="text-lg font-semibold text-neutral-900 mb-3">Genres</h4>
                <div className="flex flex-wrap gap-2">
                  {movieDetails.genres.map((genre: any) => (
                    <span key={genre.id} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                      {genre.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Synopsis étendu */}
            {movieDetails.overview && (
              <div className="mt-6">
                <h4 className="text-lg font-semibold text-neutral-900 mb-3">Synopsis complet</h4>
                <p className="text-neutral-700 leading-relaxed">{movieDetails.overview}</p>
              </div>
            )}
          </div>
        )}

        {/* Formulaire d'ajout à la collection */}
        {showReviewForm && (
          <div className="mt-8">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-2">
                🎬 Ajouter "{movieDetails?.title}" à votre collection
              </h3>
              <p className="text-blue-700 text-sm">
                Partagez votre avis sur ce film en notant et en critiquant. Vous pourrez toujours modifier votre avis plus tard.
              </p>
            </div>
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
