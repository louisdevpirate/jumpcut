'use client';

interface SkeletonProps {
  className?: string;
  width?: string | number;
  height?: string | number;
  rounded?: boolean;
}

export function Skeleton({ 
  className = '', 
  width = '100%', 
  height = '1rem', 
  rounded = false 
}: SkeletonProps) {
  return (
    <div
      className={`bg-gray-200 animate-pulse ${rounded ? 'rounded-full' : 'rounded'} ${className}`}
      style={{ width, height }}
    />
  );
}

// Skeleton spécialisé pour les cartes de films
export function FilmCardSkeleton() {
  return (
    <div className="w-48 h-72 bg-gray-200 rounded-lg animate-pulse overflow-hidden">
      <div className="w-full h-full bg-gradient-to-br from-gray-200 via-gray-300 to-gray-200 animate-pulse" />
    </div>
  );
}

// Skeleton pour les grilles de films
export function FilmGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="space-y-3">
          <FilmCardSkeleton />
          <div className="space-y-2">
            <Skeleton width="80%" height="0.875rem" />
            <Skeleton width="60%" height="0.75rem" />
          </div>
        </div>
      ))}
    </div>
  );
}

// Skeleton pour les carrousels
export function CarouselSkeleton() {
  return (
    <div className="carousel-container">
      <div className="carousel-content">
        {Array.from({ length: 8 }, (_, i) => (
          <div key={i} className="space-y-2">
            <FilmCardSkeleton />
            <div className="space-y-1 px-1">
              <Skeleton width="90%" height="0.875rem" />
              <Skeleton width="70%" height="0.75rem" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Skeleton pour les pages de détail
export function DetailPageSkeleton() {
  return (
    <div className="min-h-screen py-8 pt-48">
      <div className="max-w-6xl mx-auto px-6">
        {/* En-tête */}
        <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-8 mb-8">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Photo */}
            <div className="flex-shrink-0">
              <Skeleton width={192} height={192} className="rounded-xl" />
            </div>
            
            {/* Informations */}
            <div className="flex-1 space-y-4">
              <Skeleton width="60%" height="2.5rem" />
              <div className="space-y-2">
                <Skeleton width="100%" height="1rem" />
                <Skeleton width="90%" height="1rem" />
                <Skeleton width="80%" height="1rem" />
              </div>
              
              {/* Statistiques */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Array.from({ length: 4 }, (_, i) => (
                  <div key={i} className="bg-gray-100 p-4 rounded-lg">
                    <Skeleton width="2rem" height="2rem" className="mb-2" />
                    <Skeleton width="80%" height="0.875rem" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Films populaires */}
        <div className="mb-8">
          <Skeleton width="40%" height="2rem" className="mb-6" />
          <FilmGridSkeleton count={6} />
        </div>

        {/* Filmographie */}
        <div className="mb-8">
          <Skeleton width="50%" height="2rem" className="mb-6" />
          <FilmGridSkeleton count={20} />
        </div>
      </div>
    </div>
  );
}
