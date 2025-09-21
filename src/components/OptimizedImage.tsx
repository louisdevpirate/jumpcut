'use client';

import Image from 'next/image';
import { useState } from 'react';

interface OptimizedImageProps {
  src: string | null | undefined;
  alt: string;
  width?: number;
  height?: number;
  fill?: boolean;
  className?: string;
  priority?: boolean;
  sizes?: string;
  quality?: number;
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
}

// Tailles TMDb disponibles
const TMDB_SIZES = {
  w92: 92,
  w154: 154,
  w185: 185,
  w342: 342,
  w500: 500,
  w780: 780,
  original: 'original'
} as const;

type TMDBSize = keyof typeof TMDB_SIZES;

// Déterminer la taille optimale basée sur la largeur demandée
function getOptimalTMDBSize(width?: number, fill?: boolean): TMDBSize {
  if (fill) return 'w500'; // Pour les images en fill, utiliser une taille moyenne
  
  if (!width) return 'w342'; // Par défaut
  
  if (width <= 92) return 'w92';
  if (width <= 154) return 'w154';
  if (width <= 185) return 'w185';
  if (width <= 342) return 'w342';
  if (width <= 500) return 'w500';
  if (width <= 780) return 'w780';
  return 'original';
}

// Générer l'URL TMDb optimisée
function getOptimizedTMDBUrl(src: string | null | undefined, size: TMDBSize): string {
  if (!src || src === 'null' || src === 'undefined') {
    return '/placeholder-poster.svg';
  }
  
  // Si c'est déjà une URL TMDb complète
  if (src.startsWith('https://image.tmdb.org/')) {
    return src;
  }
  
  // Si c'est un chemin TMDb (commence par /)
  if (src.startsWith('/')) {
    return `https://image.tmdb.org/t/p/${size}${src}`;
  }
  
  // Sinon, retourner tel quel (pour les images locales)
  return src;
}

// Placeholder blur par défaut
const DEFAULT_BLUR_DATA_URL = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k=';

export default function OptimizedImage({
  src,
  alt,
  width,
  height,
  fill = false,
  className = '',
  priority = false,
  sizes,
  quality = 75,
  placeholder = 'blur',
  blurDataURL = DEFAULT_BLUR_DATA_URL,
  ...props
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  // Déterminer la taille optimale
  const optimalSize = getOptimalTMDBSize(width, fill);
  const optimizedSrc = getOptimizedTMDBUrl(src, optimalSize);

  // Générer les sizes responsive si non fourni
  const responsiveSizes = sizes || (fill ? '100vw' : `${width || 300}px`);

  const handleLoad = () => {
    setIsLoading(false);
  };

  const handleError = () => {
    setHasError(true);
    setIsLoading(false);
  };

  // Si erreur, afficher le placeholder
  if (hasError) {
    return (
      <div 
        className={`bg-gray-800 flex items-center justify-center ${className}`}
        style={fill ? {} : { width, height }}
      >
        <span className="text-gray-500 text-xs">Image non disponible</span>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      <Image
        src={optimizedSrc}
        alt={alt}
        width={fill ? undefined : width}
        height={fill ? undefined : height}
        fill={fill}
        className={`transition-opacity duration-300 ${
          isLoading ? 'opacity-0' : 'opacity-100'
        }`}
        priority={priority}
        sizes={responsiveSizes}
        quality={quality}
        placeholder={placeholder}
        blurDataURL={blurDataURL}
        onLoad={handleLoad}
        onError={handleError}
        {...props}
      />
      
      {/* Loading skeleton */}
      {isLoading && (
        <div 
          className="absolute inset-0 bg-gray-800 animate-pulse"
          style={fill ? {} : { width, height }}
        />
      )}
    </div>
  );
}

// Hook pour obtenir l'URL optimisée (utile pour les cas spéciaux)
export function useOptimizedTMDBUrl(src: string | null | undefined, size: TMDBSize = 'w342'): string {
  return getOptimizedTMDBUrl(src, size);
}

// Composants spécialisés pour différents cas d'usage
export function PosterImage({ 
  src, 
  alt, 
  width = 200, 
  height = 300,
  priority = false,
  ...props 
}: Omit<OptimizedImageProps, 'fill'>) {
  return (
    <OptimizedImage
      src={src}
      alt={alt}
      width={width}
      height={height}
      priority={priority}
      sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw"
      {...props}
    />
  );
}

export function ProfileImage({ 
  src, 
  alt, 
  width = 150, 
  height = 150,
  priority = false,
  ...props 
}: Omit<OptimizedImageProps, 'fill'>) {
  return (
    <OptimizedImage
      src={src}
      alt={alt}
      width={width}
      height={height}
      priority={priority}
      sizes="(max-width: 768px) 25vw, (max-width: 1200px) 20vw, 15vw"
      className="rounded-full"
      {...props}
    />
  );
}

export function BackdropImage({ 
  src, 
  alt,
  priority = false,
  ...props 
}: Omit<OptimizedImageProps, 'width' | 'height'>) {
  return (
    <OptimizedImage
      src={src}
      alt={alt}
      fill
      priority={priority}
      sizes="100vw"
      quality={85}
      {...props}
    />
  );
}
