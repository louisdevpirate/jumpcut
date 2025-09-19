import { NextResponse } from 'next/server';
import { getStatistics } from '@/lib/films';

// GET /api/statistics - Récupérer les statistiques
export async function GET() {
  try {
    const stats = getStatistics();
    return NextResponse.json(stats);
  } catch (error) {
    return NextResponse.json({ error: 'Erreur lors du chargement des statistiques' }, { status: 500 });
  }
}
