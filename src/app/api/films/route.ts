import { NextRequest, NextResponse } from 'next/server';
import { loadFilms, saveFilms, findFilmById, updateFilm, addFilm, deleteFilm, getStatistics } from '@/lib/films';

// GET /api/films - Récupérer tous les films
export async function GET() {
  try {
    const films = loadFilms();
    return NextResponse.json(films);
  } catch (error) {
    return NextResponse.json({ error: 'Erreur lors du chargement des films' }, { status: 500 });
  }
}

// POST /api/films - Ajouter un nouveau film
export async function POST(request: NextRequest) {
  try {
    const filmData = await request.json();
    const newFilm = addFilm(filmData);
    return NextResponse.json(newFilm, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Erreur lors de l\'ajout du film' }, { status: 500 });
  }
}
