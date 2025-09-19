import Image from "next/image";

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
}

export default function FilmDetail({ film, tmdbData }: FilmDetailProps) {
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
          <div className="flex items-center gap-2 mb-6">
            <span className="text-sm font-medium text-neutral-700">Ma note :</span>
            <div className="flex items-center gap-1 text-yellow-400">
              {Array.from({ length: 10 }, (_, i) => (
                <span key={i}>{i < film.myRating ? "★" : "☆"}</span>
              ))}
              <span className="ml-2 text-lg font-semibold text-neutral-900">{film.myRating}/10</span>
            </div>
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
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div className="critique-positive rounded-lg p-6 animate-slide-in">
          <h3 className="text-lg font-semibold text-green-800 mb-3">Points positifs</h3>
          <p className="text-green-700">{film.positives}</p>
        </div>
        
        <div className="critique-negative rounded-lg p-6 animate-slide-in" style={{ animationDelay: '0.1s' }}>
          <h3 className="text-lg font-semibold text-red-800 mb-3">Points négatifs</h3>
          <p className="text-red-700">{film.negatives}</p>
        </div>
      </div>

      {/* Critique complète */}
      <div className="bg-white border border-neutral-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-neutral-900 mb-3">Ma critique</h3>
        <p className="text-neutral-700 leading-relaxed">{film.myReview}</p>
      </div>
    </div>
  );
}
