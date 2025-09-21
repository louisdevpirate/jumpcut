import { getMovieDetails } from "@/lib/tmdb";
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { FaArrowLeft, FaStar, FaCalendarAlt, FaUser, FaFilm } from 'react-icons/fa';
import WishlistButton from '@/components/WishlistButton';
import QuickReviewButton from '@/components/QuickReviewButton';

interface MoviePageProps {
  params: Promise<{
    id: string;
  }>;
}

// ISR - Revalidation toutes les 24h
export const revalidate = 86400; // 24 heures

// Métadonnées dynamiques pour le SEO
export async function generateMetadata({ params }: MoviePageProps) {
  const { id } = await params;
  const movieId = parseInt(id);
  
  console.log('🔍 MoviePage - Recherche du film TMDb avec ID:', movieId);
  
  try {
    const movieDetails = await getMovieDetails(movieId);
    
    if (!movieDetails) {
      return {
        title: 'Film non trouvé',
        description: 'Ce film n\'existe pas.',
      };
    }

    return {
      title: `${movieDetails.title} (${new Date(movieDetails.release_date).getFullYear()}) - JumpCut`,
      description: movieDetails.overview || `Film ${movieDetails.title}`,
      openGraph: {
        title: `${movieDetails.title} (${new Date(movieDetails.release_date).getFullYear()})`,
        description: movieDetails.overview || `Film ${movieDetails.title}`,
        images: movieDetails.poster_path ? [
          {
            url: `https://image.tmdb.org/t/p/w500${movieDetails.poster_path}`,
            width: 500,
            height: 750,
            alt: movieDetails.title,
          }
        ] : [],
      },
    };
  } catch (error) {
    console.error('❌ Erreur lors de la génération des métadonnées:', error);
    return {
      title: 'Film non trouvé',
      description: 'Ce film n\'existe pas.',
    };
  }
}

export default async function MoviePage({ params }: MoviePageProps) {
  const { id } = await params;
  const movieId = parseInt(id);
  
  console.log('🔍 MoviePage - Recherche du film TMDb avec ID:', movieId);
  
  try {
    const movieDetails = await getMovieDetails(movieId);
    
    console.log('📁 Film TMDb trouvé:', movieDetails ? `${movieDetails.title} (TMDb: ${movieId})` : 'AUCUN FILM');
    
    if (!movieDetails) {
      console.log('❌ Film TMDb non trouvé, redirection vers notFound()');
      notFound();
    }

    // Trouver le réalisateur
    const director = movieDetails.credits?.crew.find(person => person.job === 'Director');
    
    // Acteurs principaux
    const mainCast = movieDetails.credits?.cast.slice(0, 5) || [];

    return (
      <div className="min-h-screen bg-black text-white pt-48">
        <div className="max-w-7xl mx-auto px-6">
          {/* Bouton retour */}
          <div className="mb-6">
            <Link 
              href="/"
              className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors"
            >
              <FaArrowLeft className="text-sm" />
              Retour à l'accueil
            </Link>
          </div>

          {/* En-tête du film */}
          <div className="flex flex-col lg:flex-row gap-8 mb-12">
            {/* Affiche */}
            <div className="flex-shrink-0">
              <div className="relative w-80 h-[480px] rounded-xl overflow-hidden">
                <Image
                  src={movieDetails.poster_path ? `https://image.tmdb.org/t/p/w500${movieDetails.poster_path}` : '/placeholder-poster.svg'}
                  alt={movieDetails.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>
            
            {/* Informations */}
            <div className="flex-1">
              <h1 className="text-4xl font-bold mb-4 font-satoshi">
                {movieDetails.title}
              </h1>
              
              {/* Métadonnées */}
              <div className="flex items-center gap-6 mb-6 text-gray-300">
                <div className="flex items-center gap-2">
                  <FaCalendarAlt className="text-sm" />
                  <span>{new Date(movieDetails.release_date).getFullYear()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaStar className="text-yellow-400" />
                  <span>{movieDetails.vote_average.toFixed(1)}/10</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaFilm className="text-sm" />
                  <span>{movieDetails.runtime} min</span>
                </div>
              </div>

              {/* Genres */}
              {movieDetails.genres && movieDetails.genres.length > 0 && (
                <div className="mb-6">
                  <div className="flex flex-wrap gap-2">
                    {movieDetails.genres.map((genre: any) => (
                      <span 
                        key={genre.id}
                        className="px-3 py-1 bg-gray-800 text-gray-300 rounded-full text-sm"
                      >
                        {genre.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Synopsis */}
              {movieDetails.overview && (
                <div className="mb-8">
                  <h3 className="text-xl font-semibold mb-3">Synopsis</h3>
                  <p className="text-gray-300 leading-relaxed">
                    {movieDetails.overview}
                  </p>
                </div>
              )}

              {/* Réalisateur */}
              {director && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                    <FaUser className="text-sm" />
                    Réalisateur
                  </h3>
                  <p className="text-gray-300">{director.name}</p>
                </div>
              )}

              {/* Acteurs principaux */}
              {mainCast.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-lg font-semibold mb-3">Acteurs principaux</h3>
                  <div className="flex flex-wrap gap-2">
                    {mainCast.map((actor: any) => (
                      <span 
                        key={actor.id}
                        className="px-3 py-1 bg-gray-800 text-gray-300 rounded-full text-sm"
                      >
                        {actor.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Boutons d'action */}
              <div className="flex items-center gap-4">
                <QuickReviewButton 
                  movieId={movieId} 
                  movieTitle={movieDetails.title}
                  variant="primary"
                />
                <WishlistButton 
                  movieId={movieId} 
                  movieTitle={movieDetails.title}
                  tmdbId={movieId}
                  title={movieDetails.title}
                  year={new Date(movieDetails.release_date).getFullYear()}
                  poster_path={movieDetails.poster_path}
                  overview={movieDetails.overview}
                  variant="secondary"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('❌ Erreur lors du chargement du film TMDb:', error);
    notFound();
  }
}
