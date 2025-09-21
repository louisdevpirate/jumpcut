'use client';

import { FixedSizeGrid as Grid } from 'react-window';
import { memo } from 'react';
import OptimizedFilmImage from './OptimizedFilmImage';

interface VirtualizedFilmGridProps {
  films: any[];
  onFilmClick?: (film: any) => void;
  className?: string;
}

interface GridItemProps {
  columnIndex: number;
  rowIndex: number;
  style: React.CSSProperties;
  data: {
    films: any[];
    onFilmClick?: (film: any) => void;
  };
}

const GridItem = memo(({ columnIndex, rowIndex, style, data }: GridItemProps) => {
  const { films, onFilmClick } = data;
  const filmIndex = rowIndex * 6 + columnIndex; // 6 colonnes
  const film = films[filmIndex];

  if (!film) {
    return <div style={style} />;
  }

  return (
    <div style={style} className="p-2">
      <div 
        className="cursor-pointer group"
        onClick={() => onFilmClick?.(film)}
      >
        <div className="relative aspect-[2/3] rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-shadow">
          <OptimizedFilmImage
            src={film.poster_path ? `https://image.tmdb.org/t/p/w300${film.poster_path}` : '/placeholder-poster.svg'}
            alt={film.title}
            width={200}
            height={300}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 150px, (max-width: 1200px) 200px, 300px"
            quality={75}
          />
          
          {/* Badge "Vu" */}
          <div className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded font-medium">
            ✅ Vu
          </div>
          
          {/* Note personnelle */}
          {film.myRating > 0 && (
            <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
              ⭐ {(film.myRating / 2).toFixed(1)}
            </div>
          )}
        </div>
        
        <div className="mt-2">
          <h3 className="font-semibold text-sm truncate">{film.title}</h3>
          <p className="text-xs text-gray-500">{film.year}</p>
        </div>
      </div>
    </div>
  );
});

GridItem.displayName = 'GridItem';

export default function VirtualizedFilmGrid({ 
  films, 
  onFilmClick, 
  className = '' 
}: VirtualizedFilmGridProps) {
  const columnCount = 6; // Nombre de colonnes fixes
  const rowCount = Math.ceil(films.length / columnCount);
  const itemHeight = 400; // Hauteur d'une ligne (image + texte)

  return (
    <div className={`w-full h-[600px] ${className}`}>
      <Grid
        columnCount={columnCount}
        columnWidth={200}
        height={600}
        rowCount={rowCount}
        rowHeight={itemHeight}
        width="100%"
        itemData={{ films, onFilmClick }}
        overscanRowCount={2} // Pré-charger 2 lignes supplémentaires
        overscanColumnCount={1} // Pré-charger 1 colonne supplémentaire
      >
        {GridItem}
      </Grid>
    </div>
  );
}
