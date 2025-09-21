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
  // Compatibilité avec l'ancien format
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
    // Si le fichier n'existe pas, retourner un tableau vide
    return [];
  }
}

// Écrire les films
async function writeFilms(films: FilmLocal[]): Promise<void> {
  await fs.mkdir(path.dirname(FILMS_FILE), { recursive: true });
  await fs.writeFile(FILMS_FILE, JSON.stringify(films, null, 2));
}

// Ajouter ou mettre à jour un film
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { tmdbId, rating, review, title, year } = body;

    if (!tmdbId || rating === undefined || !review) {
      return NextResponse.json(
        { error: 'Données manquantes: tmdbId, rating et review requis' },
        { status: 400 }
      );
    }

    // Récupérer les détails du film depuis TMDb pour obtenir le poster
    let posterUrl = '';
    let movieTitle = title || 'Film sans titre';
    let movieYear = year || new Date().getFullYear();
    
    try {
      const tmdbResponse = await fetch(
        `https://api.themoviedb.org/3/movie/${tmdbId}?api_key=${process.env.TMDB_API_KEY}&language=fr-FR`
      );
      if (tmdbResponse.ok) {
        const tmdbData = await tmdbResponse.json();
        posterUrl = tmdbData.poster_path || '';
        movieTitle = tmdbData.title || movieTitle;
        movieYear = tmdbData.release_date ? new Date(tmdbData.release_date).getFullYear() : movieYear;
      }
    } catch (error) {
      console.warn('Impossible de récupérer les détails TMDb:', error);
    }

    if (rating < 0 || rating > 5 || rating % 0.5 !== 0) {
      return NextResponse.json(
        { error: 'Rating invalide: doit être entre 0 et 5 par pas de 0.5' },
        { status: 400 }
      );
    }

    if (review.length > 140) {
      return NextResponse.json(
        { error: 'Critique trop longue: maximum 140 caractères' },
        { status: 400 }
      );
    }

    const films = await readFilms();
    const existingFilmIndex = films.findIndex(f => f.tmdbId === tmdbId);

    const now = new Date().toISOString();
    const filmData: FilmLocal = {
      tmdbId,
      title: movieTitle,
      year: movieYear,
      posterUrl: posterUrl,
      dateWatched: now,
      rating5: rating,
      quickReview140: review.trim(),
      // Compatibilité avec l'ancien format
      myRating: rating * 2, // Convertir de 5 à 10 étoiles
      myReview: review.trim(),
      positives: '',
      negatives: '',
      createdAt: existingFilmIndex >= 0 ? films[existingFilmIndex].createdAt : now,
      updatedAt: now,
      overrides: body.overrides || {}
    };

    if (existingFilmIndex >= 0) {
      // Mettre à jour le film existant
      films[existingFilmIndex] = {
        ...films[existingFilmIndex],
        ...filmData,
        createdAt: films[existingFilmIndex].createdAt // Préserver la date de création
      };
    } else {
      // Ajouter un nouveau film
      films.push(filmData);
    }

    await writeFilms(films);

    return NextResponse.json({
      success: true,
      film: existingFilmIndex >= 0 ? films[existingFilmIndex] : filmData
    });

  } catch (error) {
    console.error('Erreur lors de la sauvegarde de la critique:', error);
    return NextResponse.json(
      { error: 'Erreur serveur lors de la sauvegarde' },
      { status: 500 }
    );
  }
}

// Récupérer les films
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '50');
    const sort = url.searchParams.get('sort') || 'dateWatched';
    const q = url.searchParams.get('q') || '';

    const films = await readFilms();

    // Filtrer par recherche
    let filteredFilms = films;
    if (q) {
      const query = q.toLowerCase();
      filteredFilms = films.filter(film =>
        film.title.toLowerCase().includes(query) ||
        (film.year && film.year.toString().includes(query)) ||
        film.quickReview140?.toLowerCase().includes(query) ||
        film.myReview?.toLowerCase().includes(query)
      );
    }

    // Trier
    filteredFilms.sort((a, b) => {
      switch (sort) {
        case 'title':
          return a.title.localeCompare(b.title);
        case 'year':
          const yearA = a.year || 0;
          const yearB = b.year || 0;
          return yearB - yearA;
        case 'rating':
          const ratingA = a.rating5 || (a.myRating ? a.myRating / 2 : 0);
          const ratingB = b.rating5 || (b.myRating ? b.myRating / 2 : 0);
          return ratingB - ratingA;
        case 'dateWatched':
        default:
          return new Date(b.dateWatched || 0).getTime() - new Date(a.dateWatched || 0).getTime();
      }
    });

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedFilms = filteredFilms.slice(startIndex, endIndex);

    return NextResponse.json({
      films: paginatedFilms,
      pagination: {
        page,
        limit,
        total: filteredFilms.length,
        totalPages: Math.ceil(filteredFilms.length / limit)
      }
    });

  } catch (error) {
    console.error('Erreur lors de la récupération des films:', error);
    return NextResponse.json(
      { error: `Erreur serveur lors de la récupération: ${error instanceof Error ? error.message : 'Erreur inconnue'}` },
      { status: 500 }
    );
  }
}
