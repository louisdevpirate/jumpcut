'use client';

interface WatchedButtonProps {
  isWatched: boolean;
  onToggle?: (isWatched: boolean) => void;
  movieId?: number;
}

export default function WatchedButton({ isWatched, onToggle, movieId }: WatchedButtonProps) {
  // Si le film est dans notre collection, il est automatiquement considéré comme vu
  if (isWatched) {
    return (
      <div className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium bg-green-500 text-white">
        <span className="text-lg">✓</span>
        <span>Vu</span>
      </div>
    );
  }

  // Si le film n'est pas dans notre collection, on peut l'ajouter
  const handleAddToCollection = async () => {
    if (!onToggle) return;
    
    try {
      await onToggle(true);
    } catch (error) {
      console.error('Erreur lors de l\'ajout à la collection:', error);
    }
  };

  return (
    <button
      onClick={handleAddToCollection}
      className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium bg-blue-500 text-white hover:bg-blue-600 transition-colors"
    >
      <span className="text-lg">+</span>
      <span>Ajouter à ma collection</span>
    </button>
  );
}
