'use client';

import { useState } from 'react';
import StarRating from './StarRating';

interface ReviewFormProps {
  initialData?: {
    rating: number;
    positives: string;
    negatives: string;
    review: string;
    dateWatched: string;
  };
  onSubmit: (data: {
    rating: number;
    positives: string;
    negatives: string;
    review: string;
    dateWatched: string;
  }) => void;
  onCancel?: () => void;
  isEditing?: boolean;
}

export default function ReviewForm({ 
  initialData, 
  onSubmit, 
  onCancel, 
  isEditing = false 
}: ReviewFormProps) {
  const [formData, setFormData] = useState({
    rating: initialData?.rating || 0,
    positives: initialData?.positives || '',
    negatives: initialData?.negatives || '',
    review: initialData?.review || '',
    dateWatched: initialData?.dateWatched || new Date().toISOString().split('T')[0]
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.rating === 0) {
      alert('Veuillez donner une note au film');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Erreur lors de la soumission:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-neutral-200 p-6">
      <h3 className="text-xl font-bold text-neutral-900 mb-6">
        {isEditing ? 'Modifier ma critique' : 'Ajouter ma critique'}
      </h3>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Note */}
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-3">
            Ma note
          </label>
          <StarRating
            rating={formData.rating}
            onRatingChange={(rating) => handleInputChange('rating', rating)}
            interactive={true}
            size="lg"
          />
        </div>

        {/* Date de visionnage */}
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Date de visionnage
          </label>
          <input
            type="date"
            value={formData.dateWatched}
            onChange={(e) => handleInputChange('dateWatched', e.target.value)}
            className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Points positifs */}
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Points positifs
          </label>
          <textarea
            value={formData.positives}
            onChange={(e) => handleInputChange('positives', e.target.value)}
            placeholder="Ce qui vous a plu dans ce film..."
            className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-20 resize-none"
          />
        </div>

        {/* Points négatifs */}
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Points négatifs
          </label>
          <textarea
            value={formData.negatives}
            onChange={(e) => handleInputChange('negatives', e.target.value)}
            placeholder="Ce qui vous a déplu dans ce film..."
            className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-20 resize-none"
          />
        </div>

        {/* Critique complète */}
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Ma critique complète
          </label>
          <textarea
            value={formData.review}
            onChange={(e) => handleInputChange('review', e.target.value)}
            placeholder="Votre avis détaillé sur ce film..."
            className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-32 resize-none"
            required
          />
        </div>

        {/* Boutons */}
        <div className="flex gap-4 justify-end">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-2 border border-neutral-300 text-neutral-700 font-medium rounded-lg hover:bg-neutral-50 transition"
            >
              Annuler
            </button>
          )}
          <button
            type="submit"
            disabled={isSubmitting || formData.rating === 0}
            className="btn-primary px-6 py-2 text-white font-medium rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Enregistrement...
              </div>
            ) : (
              isEditing ? 'Modifier' : 'Ajouter'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
