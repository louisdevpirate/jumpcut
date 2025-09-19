import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

interface Film {
  id: number;
  tmdbId: number | null;
  title: string;
  year: number | null;
  myRating: number;
  positives: string;
  negatives: string;
  myReview: string;
  dateWatched: string;
}

// Fonction pour lire les films
function getFilms(): Film[] {
  const filePath = path.join(process.cwd(), 'data', 'films.json');
  const fileContents = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(fileContents);
}

// Fonction pour sauvegarder les films
function saveFilms(films: Film[]): void {
  const filePath = path.join(process.cwd(), 'data', 'films.json');
  fs.writeFileSync(filePath, JSON.stringify(films, null, 2));
}

export async function PUT(request: NextRequest) {
  try {
    const { id, rating, review, title, year, posterUrl } = await request.json();

    if (!id) {
      return NextResponse.json({ error: 'ID du film requis' }, { status: 400 });
    }

    const films = getFilms();
    const filmIndex = films.findIndex(f => f.id === id);

    if (filmIndex === -1) {
      return NextResponse.json({ error: 'Film non trouvé' }, { status: 404 });
    }

    // Mise à jour des données
    if (rating !== undefined) {
      films[filmIndex].myRating = rating * 2; // Convertir de 5 étoiles à 10
    }
    
    if (review !== undefined) {
      films[filmIndex].myReview = review;
    }
    
    if (title !== undefined) {
      films[filmIndex].title = title;
    }
    
    if (year !== undefined) {
      films[filmIndex].year = year;
    }

    // Sauvegarder
    saveFilms(films);

    return NextResponse.json({ 
      success: true, 
      film: films[filmIndex] 
    });

  } catch (error) {
    console.error('Erreur lors de la mise à jour du film:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { tmdbId, title, year, rating, review } = await request.json();

    if (!tmdbId || !title || !year) {
      return NextResponse.json({ error: 'Données manquantes' }, { status: 400 });
    }

    const films = getFilms();
    
    // Vérifier si le film existe déjà
    const existingFilm = films.find(f => f.tmdbId === tmdbId);
    if (existingFilm) {
      return NextResponse.json({ error: 'Ce film est déjà dans votre collection' }, { status: 409 });
    }

    // Créer un nouveau film
    const newFilm: Film = {
      id: Math.max(...films.map(f => f.id), 0) + 1,
      tmdbId,
      title,
      year,
      myRating: rating ? rating * 2 : 0, // Convertir de 5 étoiles à 10
      positives: '',
      negatives: '',
      myReview: review || '',
      dateWatched: new Date().toISOString().split('T')[0]
    };

    films.push(newFilm);
    saveFilms(films);

    return NextResponse.json({ 
      success: true, 
      film: newFilm 
    });

  } catch (error) {
    console.error('Erreur lors de l\'ajout du film:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}