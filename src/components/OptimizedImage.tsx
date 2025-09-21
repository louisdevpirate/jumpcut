'use client';

import Image from 'next/image';

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
}

// Générer l'URL TMDb optimisée
function getOptimizedTMDBUrl(src: string | null | undefined, width?: number, fill?: boolean, isBackdrop?: boolean): string {
  if (!src || src === 'null' || src === 'undefined') {
    return '/placeholder-backdrop.svg';
  }
  
  // Si c'est déjà une URL TMDb complète
  if (src.startsWith('https://image.tmdb.org/')) {
    return src;
  }
  
  // Si c'est un chemin TMDb (commence par /)
  if (src.startsWith('/')) {
    // Choisir une taille appropriée
    let size = 'w342'; // Par défaut
    
    if (isBackdrop) {
      // Pour les images de fond (backdrop), utiliser une taille haute résolution
      size = 'w1280'; // TMDb propose w1280 pour les backdrops HD
    } else if (fill) {
      size = 'w500';
    } else if (width) {
      if (width <= 92) size = 'w92';
      else if (width <= 154) size = 'w154';
      else if (width <= 185) size = 'w185';
      else if (width <= 342) size = 'w342';
      else if (width <= 500) size = 'w500';
      else if (width <= 780) size = 'w780';
      else size = 'original';
    }
    return `https://image.tmdb.org/t/p/${size}${src}`;
  }
  
  // Sinon, retourner tel quel (pour les images locales)
  return src;
}

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
}: OptimizedImageProps) {
  const optimizedSrc = getOptimizedTMDBUrl(src, width, fill);

  return (
    <Image
      src={optimizedSrc}
      alt={alt}
      width={fill ? undefined : width}
      height={fill ? undefined : height}
      fill={fill}
      className={className}
      priority={priority}
      sizes={sizes}
      quality={quality}
      onError={(e) => {
        // Fallback vers placeholder en cas d'erreur
        const target = e.target as HTMLImageElement;
        target.src = '/placeholder-poster.svg';
      }}
    />
  );
}

// Composants spécialisés simplifiés
export function PosterImage({ 
  src, 
  alt, 
  width = 200, 
  height = 300,
  priority = false,
  className = '',
}: OptimizedImageProps) {
  return (
    <OptimizedImage
      src={src}
      alt={alt}
      width={width}
      height={height}
      priority={priority}
      className={className}
      sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw"
    />
  );
}

export function ProfileImage({ 
  src, 
  alt, 
  width = 150, 
  height = 150,
  priority = false,
  className = '',
}: OptimizedImageProps) {
  return (
    <OptimizedImage
      src={src}
      alt={alt}
      width={width}
      height={height}
      priority={priority}
      className={`rounded-full ${className}`}
      sizes="(max-width: 768px) 25vw, (max-width: 1200px) 20vw, 15vw"
    />
  );
}

export function BackdropImage({ 
  src, 
  alt,
  priority = false,
  className = '',
}: OptimizedImageProps) {
  // Utiliser une qualité et une taille optimisées pour les images de fond
  const optimizedSrc = getOptimizedTMDBUrl(src, undefined, true, true);
  
  return (
    <Image
      src={optimizedSrc}
      alt={alt}
      fill
      priority={priority}
      className={className}
      sizes="100vw"
      quality={95} // Qualité maximale pour les images de fond
      onError={(e) => {
        // Fallback vers placeholder en cas d'erreur
        const target = e.target as HTMLImageElement;
        target.src = '/placeholder-backdrop.svg';
      }}
    />
  );
}
