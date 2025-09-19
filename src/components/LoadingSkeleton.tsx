'use client';

interface LoadingSkeletonProps {
  title: string;
  type?: 'carousel' | 'list';
}

export default function LoadingSkeleton({ title, type = 'carousel' }: LoadingSkeletonProps) {
  if (type === 'list') {
    return (
      <div className="space-y-8">
        {Array.from({ length: 3 }, (_, i) => (
          <div key={i} className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Photo placeholder */}
              <div className="flex-shrink-0">
                <div className="w-32 h-48 bg-gray-200 rounded-lg animate-pulse"></div>
              </div>
              
              {/* Informations placeholder */}
              <div className="flex-1">
                <div className="h-8 bg-gray-200 rounded animate-pulse mb-4 w-1/2"></div>
                <div className="h-4 bg-gray-200 rounded animate-pulse mb-6 w-full"></div>
                <div className="h-6 bg-gray-200 rounded animate-pulse mb-4 w-1/3"></div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Array.from({ length: 6 }, (_, j) => (
                    <div key={j} className="bg-gray-100 p-3 rounded-lg">
                      <div className="h-4 bg-gray-200 rounded animate-pulse mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded animate-pulse w-1/2"></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="netflix-section">
      <h2 className="netflix-section-title">{title}</h2>
      <div className="carousel-container">
        <div className="carousel-content">
          {Array.from({ length: 8 }, (_, i) => (
            <div key={i} className="relative">
              <div className="w-48 h-72 bg-gray-800 rounded-lg animate-pulse">
                <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-800 rounded-lg"></div>
              </div>
              <div className="mt-2 px-1">
                <div className="h-4 bg-gray-800 rounded animate-pulse mb-1"></div>
                <div className="h-3 bg-gray-800 rounded animate-pulse w-2/3"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
