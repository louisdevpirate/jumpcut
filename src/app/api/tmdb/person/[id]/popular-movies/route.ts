import { NextRequest, NextResponse } from 'next/server';

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: personId } = await params;

    if (!TMDB_API_KEY) {
      return NextResponse.json({ error: 'Clé API TMDb manquante' }, { status: 500 });
    }

    // Récupérer les crédits de la personne
    const creditsResponse = await fetch(
      `${TMDB_BASE_URL}/person/${personId}/movie_credits?api_key=${TMDB_API_KEY}&language=fr-FR`
    );

    if (!creditsResponse.ok) {
      return NextResponse.json({ error: 'Erreur API TMDb' }, { status: creditsResponse.status });
    }

    const creditsData = await creditsResponse.json();
    
    // Combiner cast et crew, puis trier par popularité
    const allMovies = [
      ...(creditsData.cast || []),
      ...(creditsData.crew || [])
    ];

    // Supprimer les doublons et trier par vote_average
    const uniqueMovies = allMovies.reduce((acc: any[], movie: any) => {
      const existing = acc.find(m => m.id === movie.id);
      if (!existing) {
        acc.push(movie);
      }
      return acc;
    }, []);

    // Trier par popularité (vote_average) et prendre les 10 premiers
    const popularMovies = uniqueMovies
      .filter(movie => movie.vote_average > 0) // Filtrer les films sans note
      .sort((a, b) => b.vote_average - a.vote_average)
      .slice(0, 10);

    return NextResponse.json(popularMovies);

  } catch (error) {
    console.error('Erreur lors de la récupération des films populaires:', error);
    return NextResponse.json({ error: 'Erreur interne du serveur' }, { status: 500 });
  }
}
