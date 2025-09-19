'use client';

import { useState } from 'react';
import { FaEdit, FaSave, FaTimes, FaImage } from 'react-icons/fa';

interface FilmEditFormProps {
  film: {
    id: number;
    title: string;
    year: number | null;
    tmdbId: number | null;
  };
  onSave: (data: { title: string; year: number; posterUrl?: string }) => Promise<void>;
  onCancel: () => void;
}

export default function FilmEditForm({ film, onSave, onCancel }: FilmEditFormProps) {
  const [title, setTitle] = useState(film.title);
  const [year, setYear] = useState(film.year?.toString() || '');
  const [posterUrl, setPosterUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      alert('Le titre est obligatoire');
      return;
    }
    
    if (!year || isNaN(parseInt(year))) {
      alert('L\'année doit être un nombre valide');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSave({
        title: title.trim(),
        year: parseInt(year),
        posterUrl: posterUrl.trim() || undefined
      });
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      alert('Erreur lors de la sauvegarde');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-neutral-200 p-6 max-w-md mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-neutral-900 flex items-center gap-2">
          <FaEdit className="text-blue-500" />
          Modifier le film
        </h3>
        <button
          onClick={onCancel}
          className="text-neutral-400 hover:text-neutral-600 transition-colors"
        >
          <FaTimes className="text-lg" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Titre */}
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Titre du film
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="Titre du film"
            required
          />
        </div>

        {/* Année */}
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Année de sortie
          </label>
          <input
            type="number"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className="w-full p-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="2024"
            min="1888"
            max="2030"
            required
          />
        </div>

        {/* URL de l'affiche */}
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            URL de l'affiche (optionnel)
          </label>
          <div className="relative">
            <FaImage className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="url"
              value={posterUrl}
              onChange={(e) => setPosterUrl(e.target.value)}
              className="w-full pl-10 pr-3 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="https://example.com/poster.jpg"
            />
          </div>
          <p className="text-xs text-neutral-500 mt-1">
            Laissez vide pour garder l'affiche actuelle
          </p>
        </div>

        {/* Boutons */}
        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 px-4 py-2 border border-neutral-300 text-neutral-700 rounded-lg hover:bg-neutral-50 transition-colors"
            disabled={isSubmitting}
          >
            Annuler
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Sauvegarde...</span>
              </>
            ) : (
              <>
                <FaSave className="text-sm" />
                <span>Sauvegarder</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
