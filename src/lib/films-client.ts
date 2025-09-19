// Types et interfaces pour les films
export interface Film {
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

// Fonctions côté client pour interagir avec l'API
export async function getFilms(): Promise<Film[]> {
  try {
    const response = await fetch('/api/films');
    if (!response.ok) throw new Error('Failed to fetch films');
    return await response.json();
  } catch (error) {
    console.error('Error fetching films:', error);
    return [];
  }
}

export async function getFilmById(id: number): Promise<Film | undefined> {
  try {
    const response = await fetch(`/api/films/${id}`);
    if (!response.ok) return undefined;
    return await response.json();
  } catch (error) {
    console.error('Error fetching film:', error);
    return undefined;
  }
}

export async function addFilm(newFilmData: Omit<Film, 'id'>): Promise<Film> {
  try {
    const response = await fetch('/api/films', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newFilmData),
    });
    if (!response.ok) throw new Error('Failed to add film');
    return await response.json();
  } catch (error) {
    console.error('Error adding film:', error);
    throw error;
  }
}

export async function updateFilm(id: number, updatedFields: Partial<Film>): Promise<Film | undefined> {
  try {
    const response = await fetch(`/api/films/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedFields),
    });
    if (!response.ok) return undefined;
    return await response.json();
  } catch (error) {
    console.error('Error updating film:', error);
    return undefined;
  }
}

export async function deleteFilm(id: number): Promise<boolean> {
  try {
    const response = await fetch(`/api/films/${id}`, {
      method: 'DELETE',
    });
    return response.ok;
  } catch (error) {
    console.error('Error deleting film:', error);
    return false;
  }
}
