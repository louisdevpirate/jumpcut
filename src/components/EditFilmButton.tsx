'use client';

import { useState } from 'react';
import { FaEdit } from 'react-icons/fa';
import FilmEditForm from './FilmEditForm';

interface EditFilmButtonProps {
  film: {
    id: number;
    title: string;
    year: number | null;
    tmdbId: number | null;
  };
  onSave: (data: { title: string; year: number; posterUrl?: string }) => Promise<void>;
  variant?: 'primary' | 'secondary' | 'minimal';
  size?: 'sm' | 'md' | 'lg';
}

export default function EditFilmButton({
  film,
  onSave,
  variant = 'secondary',
  size = 'md'
}: EditFilmButtonProps) {
  const [showEditForm, setShowEditForm] = useState(false);

  const handleSave = async (data: { title: string; year: number; posterUrl?: string }) => {
    try {
      await onSave(data);
      setShowEditForm(false);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
    }
  };

  const buttonClasses = {
    primary: 'bg-blue-500 text-white hover:bg-blue-600',
    secondary: 'bg-gray-100 text-gray-700 hover:bg-gray-200',
    minimal: 'bg-transparent text-gray-500 hover:bg-gray-50 border border-gray-300'
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  };

  return (
    <>
      <button
        onClick={() => setShowEditForm(true)}
        className={`flex items-center gap-2 rounded-lg font-medium transition-colors ${buttonClasses[variant]} ${sizeClasses[size]}`}
      >
        <FaEdit className="text-sm" />
        <span>Modifier</span>
      </button>

      {showEditForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="relative">
            <FilmEditForm
              film={film}
              onSave={handleSave}
              onCancel={() => setShowEditForm(false)}
            />
          </div>
        </div>
      )}
    </>
  );
}
