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

    // Récupérer les détails de la personne
    const personResponse = await fetch(
      `${TMDB_BASE_URL}/person/${personId}?api_key=${TMDB_API_KEY}&language=fr-FR`,
      { next: { revalidate: 3600 } } // Cache pendant 1 heure
    );

    if (!personResponse.ok) {
      return NextResponse.json({ error: 'Personne non trouvée' }, { status: 404 });
    }

    const personData = await personResponse.json();

    // Récupérer les crédits de la personne
    const creditsResponse = await fetch(
      `${TMDB_BASE_URL}/person/${personId}/movie_credits?api_key=${TMDB_API_KEY}&language=fr-FR`,
      { next: { revalidate: 3600 } }
    );

    if (!creditsResponse.ok) {
      return NextResponse.json({ error: 'Crédits non trouvés' }, { status: 404 });
    }

    const creditsData = await creditsResponse.json();

    // Combiner les données
    const combinedData = {
      ...personData,
      movie_credits: creditsData
    };

    return NextResponse.json(combinedData);
  } catch (error) {
    console.error('Erreur lors de la récupération des détails de la personne:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
