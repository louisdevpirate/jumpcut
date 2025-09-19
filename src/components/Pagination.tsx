'use client';

import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  showResults?: boolean;
  totalResults?: number;
  resultsPerPage?: number;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  showResults = false,
  totalResults = 0,
  resultsPerPage = 20
}: PaginationProps) {
  // Calculer les pages à afficher
  const getVisiblePages = () => {
    const delta = 2; // Nombre de pages à afficher de chaque côté
    const range = [];
    const rangeWithDots = [];

    for (let i = Math.max(2, currentPage - delta); 
         i <= Math.min(totalPages - 1, currentPage + delta); 
         i++) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...');
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages);
    } else {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  const visiblePages = getVisiblePages();
  const startResult = (currentPage - 1) * resultsPerPage + 1;
  const endResult = Math.min(currentPage * resultsPerPage, totalResults);

  if (totalPages <= 1) return null;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8">
      {/* Résultats affichés */}
      {showResults && totalResults > 0 && (
        <div className="text-sm text-neutral-600">
          Affichage de {startResult} à {endResult} sur {totalResults} résultats
        </div>
      )}

      {/* Navigation */}
      <div className="flex items-center gap-2">
        {/* Bouton Précédent */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition ${
            currentPage === 1
              ? 'text-neutral-400 cursor-not-allowed'
              : 'text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900'
          }`}
        >
          <FaChevronLeft className="w-3 h-3" />
          Précédent
        </button>

        {/* Pages */}
        <div className="flex items-center gap-1">
          {visiblePages.map((page, index) => {
            if (page === '...') {
              return (
                <span key={`dots-${index}`} className="px-2 py-1 text-neutral-500">
                  ...
                </span>
              );
            }

            const pageNumber = page as number;
            const isCurrentPage = pageNumber === currentPage;

            return (
              <button
                key={pageNumber}
                onClick={() => onPageChange(pageNumber)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                  isCurrentPage
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900'
                }`}
              >
                {pageNumber}
              </button>
            );
          })}
        </div>

        {/* Bouton Suivant */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition ${
            currentPage === totalPages
              ? 'text-neutral-400 cursor-not-allowed'
              : 'text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900'
          }`}
        >
          Suivant
          <FaChevronRight className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
}
