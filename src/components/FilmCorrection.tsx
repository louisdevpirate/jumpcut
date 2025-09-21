'use client';

import { useState, useEffect } from 'react';
import { useFilms, FilmLocal } from '@/hooks/useFilms';
import { FaSearch, FaEdit, FaSave, FaTimes, FaCheck } from 'react-icons/fa';

interface FilmCorrectionProps {
  film: FilmLocal;
  onSave: (correctedFilm: FilmLocal) => void;
  onCancel: () => void;
}

export default function FilmCorrection({ film, onSave, onCancel }: FilmCorrectionProps) {
  const [correctedFilm, setCorrectedFilm] = useState<FilmLocal>(film);
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    setIsLoading(true);
    try {
      await onSave(correctedFilm);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[9999] p-4">
      <div className="bg-gray-900 rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white font-satoshi">
            Corriger les informations
          </h2>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <FaTimes className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-6">
          {/* Titre */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Titre du film
            </label>
            <input
              type="text"
              value={correctedFilm.title}
              onChange={(e) => setCorrectedFilm(prev => ({ ...prev, title: e.target.value }))}
              className="w-full p-3 bg-gray-800 border border-gray-700 rounded-md focus:ring-blue-500 focus:border-blue-500 outline-none text-white"
            />
          </div>

          {/* Année */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Année de sortie
            </label>
            <input
              type="number"
              value={correctedFilm.year}
              onChange={(e) => setCorrectedFilm(prev => ({ ...prev, year: parseInt(e.target.value) }))}
              className="w-full p-3 bg-gray-800 border border-gray-700 rounded-md focus:ring-blue-500 focus:border-blue-500 outline-none text-white"
            />
          </div>

          {/* ID TMDb */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              ID TMDb
            </label>
            <input
              type="number"
              value={correctedFilm.tmdbId}
              onChange={(e) => setCorrectedFilm(prev => ({ ...prev, tmdbId: parseInt(e.target.value) }))}
              className="w-full p-3 bg-gray-800 border border-gray-700 rounded-md focus:ring-blue-500 focus:border-blue-500 outline-none text-white"
            />
            <p className="text-xs text-gray-400 mt-1">
              Changer l'ID TMDb récupérera automatiquement les nouvelles informations
            </p>
          </div>

          {/* Poster URL */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              URL du poster
            </label>
            <input
              type="text"
              value={correctedFilm.posterUrl || ''}
              onChange={(e) => setCorrectedFilm(prev => ({ ...prev, posterUrl: e.target.value }))}
              className="w-full p-3 bg-gray-800 border border-gray-700 rounded-md focus:ring-blue-500 focus:border-blue-500 outline-none text-white"
              placeholder="/path/to/poster.jpg"
            />
          </div>

          {/* Critique rapide */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Critique rapide
            </label>
            <textarea
              value={correctedFilm.quickReview140 || ''}
              onChange={(e) => setCorrectedFilm(prev => ({ ...prev, quickReview140: e.target.value }))}
              maxLength={140}
              rows={3}
              className="w-full p-3 bg-gray-800 border border-gray-700 rounded-md focus:ring-blue-500 focus:border-blue-500 outline-none text-white resize-none"
              placeholder="Votre critique en 140 caractères..."
            />
            <p className="text-xs text-gray-400 mt-1">
              {(correctedFilm.quickReview140 || '').length}/140 caractères
            </p>
          </div>

          {/* Note */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Note (sur 5)
            </label>
            <select
              value={correctedFilm.rating5 || 0}
              onChange={(e) => setCorrectedFilm(prev => ({ ...prev, rating5: parseFloat(e.target.value) as any }))}
              className="w-full p-3 bg-gray-800 border border-gray-700 rounded-md focus:ring-blue-500 focus:border-blue-500 outline-none text-white"
            >
              <option value={0}>Non noté</option>
              <option value={0.5}>0.5 ⭐</option>
              <option value={1}>1 ⭐</option>
              <option value={1.5}>1.5 ⭐</option>
              <option value={2}>2 ⭐</option>
              <option value={2.5}>2.5 ⭐</option>
              <option value={3}>3 ⭐</option>
              <option value={3.5}>3.5 ⭐</option>
              <option value={4}>4 ⭐</option>
              <option value={4.5}>4.5 ⭐</option>
              <option value={5}>5 ⭐</option>
            </select>
          </div>
        </div>

        {/* Boutons d'action */}
        <div className="flex justify-end gap-3 mt-8">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600 transition"
            disabled={isLoading}
          >
            Annuler
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition flex items-center gap-2"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Sauvegarde...
              </>
            ) : (
              <>
                <FaSave className="w-4 h-4" />
                Sauvegarder
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
