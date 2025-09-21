import { NextRequest, NextResponse } from 'next/server';

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query');
    const language = searchParams.get('language') || 'fr-FR';
    const page = searchParams.get('page') || '1';

    if (!query) {
      return NextResponse.json(
        { error: 'Paramètre query requis' },
        { status: 400 }
      );
    }

    if (!TMDB_API_KEY) {
      return NextResponse.json(
        { error: 'Clé API TMDb manquante' },
        { status: 500 }
      );
    }

    // Recherche multi-type (films, séries, personnalités)
    const searchUrl = `${TMDB_BASE_URL}/search/multi?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}&language=${language}&page=${page}&include_adult=false`;

    const response = await fetch(searchUrl);
    
    if (!response.ok) {
      throw new Error(`Erreur API TMDb: ${response.status}`);
    }

    const data = await response.json();
    
    // Filtrer et formater les résultats
    const formattedResults = data.results
      .filter((item: any) => {
        // Garder seulement les films, séries et personnalités
        return item.media_type === 'movie' || 
               item.media_type === 'tv' || 
               item.media_type === 'person';
      })
      .map((item: any) => ({
        id: item.id,
        title: item.title || item.name,
        release_date: item.release_date || item.first_air_date,
        poster_path: item.poster_path || item.profile_path,
        vote_average: item.vote_average || 0,
        overview: item.overview || '',
        media_type: item.media_type,
        // Informations supplémentaires pour les personnalités
        ...(item.media_type === 'person' && {
          known_for: item.known_for?.map((work: any) => ({
            title: work.title || work.name,
            media_type: work.media_type
          })) || []
        })
      }))
      .slice(0, 10); // Limiter à 10 résultats pour la performance

    return NextResponse.json({
      results: formattedResults,
      total_results: data.total_results,
      page: data.page,
      total_pages: data.total_pages
    });

  } catch (error) {
    console.error('Erreur lors de la recherche TMDb:', error);
    return NextResponse.json(
      { error: `Erreur serveur: ${error instanceof Error ? error.message : 'Erreur inconnue'}` },
      { status: 500 }
    );
  }
}
