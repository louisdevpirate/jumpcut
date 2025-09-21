import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const FILMS_FILE = path.join(process.cwd(), 'data', 'films.json');

interface FilmLocal {
  id?: number;
  tmdbId: number;
  title: string;
  year: number;
  posterUrl?: string;
  dateWatched?: string;
  rating5?: number;
  quickReview140?: string;
  myRating?: number;
  myReview?: string;
  positives?: string;
  negatives?: string;
  createdAt?: string;
  updatedAt?: string;
  overrides?: {
    posterUrl?: string | null;
    title?: string | null;
    year?: number | null;
  };
}

// Lire les films existants
async function readFilms(): Promise<FilmLocal[]> {
  try {
    const data = await fs.readFile(FILMS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

// Écrire les films
async function writeFilms(films: FilmLocal[]): Promise<void> {
  await fs.mkdir(path.dirname(FILMS_FILE), { recursive: true });
  await fs.writeFile(FILMS_FILE, JSON.stringify(films, null, 2));
}

// Corriger un film existant
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { tmdbId, title, year, posterUrl, rating5, quickReview140 } = body;

    if (!tmdbId) {
      return NextResponse.json(
        { error: 'ID TMDb requis' },
        { status: 400 }
      );
    }

    const films = await readFilms();
    const filmIndex = films.findIndex(f => f.tmdbId === tmdbId);

    if (filmIndex === -1) {
      return NextResponse.json(
        { error: 'Film non trouvé' },
        { status: 404 }
      );
    }

    // Si l'ID TMDb a changé, récupérer les nouvelles données depuis TMDb
    let finalPosterUrl = posterUrl;
    let finalTitle = title;
    let finalYear = year;

    if (tmdbId !== films[filmIndex].tmdbId) {
      try {
        const tmdbResponse = await fetch(
          `https://api.themoviedb.org/3/movie/${tmdbId}?api_key=${process.env.TMDB_API_KEY}&language=fr-FR`
        );
        if (tmdbResponse.ok) {
          const tmdbData = await tmdbResponse.json();
          finalPosterUrl = tmdbData.poster_path || posterUrl;
          finalTitle = tmdbData.title || title;
          finalYear = tmdbData.release_date ? new Date(tmdbData.release_date).getFullYear() : year;
        }
      } catch (error) {
        console.warn('Impossible de récupérer les données TMDb:', error);
      }
    }

    // Mettre à jour le film
    const updatedFilm: FilmLocal = {
      ...films[filmIndex],
      tmdbId,
      title: finalTitle || films[filmIndex].title,
      year: finalYear || films[filmIndex].year,
      posterUrl: finalPosterUrl || films[filmIndex].posterUrl,
      rating5: rating5 !== undefined ? rating5 : films[filmIndex].rating5,
      quickReview140: quickReview140 !== undefined ? quickReview140 : films[filmIndex].quickReview140,
      // Synchroniser avec l'ancien format
      myRating: rating5 !== undefined ? rating5 * 2 : films[filmIndex].myRating,
      myReview: quickReview140 !== undefined ? quickReview140 : films[filmIndex].myReview,
      updatedAt: new Date().toISOString()
    };

    films[filmIndex] = updatedFilm;
    await writeFilms(films);

    return NextResponse.json({
      success: true,
      film: updatedFilm
    });

  } catch (error) {
    console.error('Erreur lors de la correction du film:', error);
    return NextResponse.json(
      { error: `Erreur serveur: ${error instanceof Error ? error.message : 'Erreur inconnue'}` },
      { status: 500 }
    );
  }
}
