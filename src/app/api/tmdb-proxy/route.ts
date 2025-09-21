import { NextRequest, NextResponse } from 'next/server';

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

// Cache en mémoire pour éviter les appels répétés
const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_DURATION = 60 * 60 * 1000; // 1 heure

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const endpoint = searchParams.get('endpoint');
    const params = searchParams.get('params');

    if (!endpoint) {
      return NextResponse.json({ error: 'Endpoint manquant' }, { status: 400 });
    }

    if (!TMDB_API_KEY) {
      return NextResponse.json({ error: 'Clé API TMDb manquante' }, { status: 500 });
    }

    // Vérifier le cache
    const cacheKey = `${endpoint}?${params || ''}`;
    const cached = cache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return NextResponse.json(cached.data, {
        headers: {
          'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
          'X-Cache': 'HIT'
        }
      });
    }

    // Construire l'URL TMDb
    const tmdbUrl = `${TMDB_BASE_URL}/${endpoint}?api_key=${TMDB_API_KEY}&language=fr-FR${params ? `&${params}` : ''}`;
    
    const response = await fetch(tmdbUrl);
    
    if (!response.ok) {
      return NextResponse.json({ error: 'Erreur API TMDb' }, { status: response.status });
    }

    const data = await response.json();

    // Mettre en cache
    cache.set(cacheKey, { data, timestamp: Date.now() });

    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
        'X-Cache': 'MISS'
      }
    });

  } catch (error) {
    console.error('Erreur proxy TMDb:', error);
    return NextResponse.json({ error: 'Erreur interne du serveur' }, { status: 500 });
  }
}
