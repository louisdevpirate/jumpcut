import { NextRequest, NextResponse } from 'next/server';
import { findFilmById, updateFilm, deleteFilm } from '@/lib/films';

// GET /api/films/[id] - Récupérer un film par ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const filmId = parseInt(id);
    const film = findFilmById(filmId);
    
    if (!film) {
      return NextResponse.json({ error: 'Film non trouvé' }, { status: 404 });
    }
    
    return NextResponse.json(film);
  } catch (error) {
    return NextResponse.json({ error: 'Erreur lors du chargement du film' }, { status: 500 });
  }
}

// PUT /api/films/[id] - Mettre à jour un film
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const filmId = parseInt(id);
    const updateData = await request.json();
    
    const updatedFilm = { ...updateData, id: filmId };
    const success = updateFilm(updatedFilm);
    
    if (!success) {
      return NextResponse.json({ error: 'Film non trouvé' }, { status: 404 });
    }
    
    return NextResponse.json(updatedFilm);
  } catch (error) {
    return NextResponse.json({ error: 'Erreur lors de la mise à jour du film' }, { status: 500 });
  }
}

// DELETE /api/films/[id] - Supprimer un film
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const filmId = parseInt(id);
    const success = deleteFilm(filmId);
    
    if (!success) {
      return NextResponse.json({ error: 'Film non trouvé' }, { status: 404 });
    }
    
    return NextResponse.json({ message: 'Film supprimé avec succès' });
  } catch (error) {
    return NextResponse.json({ error: 'Erreur lors de la suppression du film' }, { status: 500 });
  }
}
