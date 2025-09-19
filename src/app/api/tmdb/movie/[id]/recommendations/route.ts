import { NextRequest, NextResponse } from 'next/server';

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: movieId } = await params;

    if (!TMDB_API_KEY) {
      return NextResponse.json({ error: 'Clé API TMDb manquante' }, { status: 500 });
    }

    const response = await fetch(
      `${TMDB_BASE_URL}/movie/${movieId}/recommendations?api_key=${TMDB_API_KEY}&language=fr-FR&page=1`
    );

    if (!response.ok) {
      throw new Error(`Erreur API TMDb: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);

  } catch (error) {
    console.error('Erreur lors de la récupération des recommandations:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
