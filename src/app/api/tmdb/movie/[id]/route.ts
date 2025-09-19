import { NextRequest, NextResponse } from 'next/server';
import { TMDB_CONFIG } from '@/config/tmdb';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const movieId = parseInt(id);
    
    const response = await fetch(
      `${TMDB_CONFIG.BASE_URL}/movie/${movieId}?api_key=${TMDB_CONFIG.API_KEY}&language=fr-FR`
    );
    
    if (!response.ok) {
      return NextResponse.json({ error: 'Film non trouvé' }, { status: response.status });
    }
    
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Erreur lors du chargement du film' }, { status: 500 });
  }
}
