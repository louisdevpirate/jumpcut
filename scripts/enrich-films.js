// Script pour enrichir les films avec les données TMDb
const fs = require('fs');
const path = require('path');

// Configuration TMDb
const TMDB_API_KEY = '292dd44388a7a411723b8465ae51f35a';
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

// Charger les films
const filmsPath = path.join(__dirname, '..', 'data', 'films.json');
const films = JSON.parse(fs.readFileSync(filmsPath, 'utf8'));

// Fonction pour rechercher un film sur TMDb
async function searchMovie(title) {
  try {
    const response = await fetch(
      `${TMDB_BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&language=fr-FR&query=${encodeURIComponent(title)}`
    );
    
    if (!response.ok) {
      throw new Error(`Erreur API TMDb: ${response.status}`);
    }
    
    const data = await response.json();
    return data.results[0]; // Prendre le premier résultat
  } catch (error) {
    console.error(`Erreur lors de la recherche de "${title}":`, error.message);
    return null;
  }
}

// Fonction pour enrichir un film
async function enrichFilm(film) {
  console.log(`🔍 Recherche de "${film.title}"...`);
  
  const tmdbData = await searchMovie(film.title);
  
  if (tmdbData) {
    film.tmdbId = tmdbData.id;
    film.year = new Date(tmdbData.release_date).getFullYear();
    console.log(`✅ Trouvé: ${film.title} (${film.year}) - ID: ${tmdbData.id}`);
  } else {
    console.log(`❌ Non trouvé: ${film.title}`);
  }
  
  // Délai pour éviter de surcharger l'API
  await new Promise(resolve => setTimeout(resolve, 200));
  
  return film;
}

// Fonction principale
async function enrichAllFilms() {
  console.log(`🚀 Début de l'enrichissement de ${films.length} films...`);
  
  const enrichedFilms = [];
  
  for (let i = 0; i < films.length; i++) {
    const film = films[i];
    const enrichedFilm = await enrichFilm(film);
    enrichedFilms.push(enrichedFilm);
    
    // Sauvegarder périodiquement (tous les 50 films)
    if ((i + 1) % 50 === 0) {
      console.log(`💾 Sauvegarde intermédiaire (${i + 1}/${films.length})...`);
      fs.writeFileSync(filmsPath, JSON.stringify(enrichedFilms, null, 2), 'utf8');
    }
  }
  
  // Sauvegarde finale
  fs.writeFileSync(filmsPath, JSON.stringify(enrichedFilms, null, 2), 'utf8');
  
  const foundCount = enrichedFilms.filter(f => f.tmdbId).length;
  console.log(`🎉 Enrichissement terminé !`);
  console.log(`📊 Résultats:`);
  console.log(`   - Films trouvés: ${foundCount}/${films.length}`);
  console.log(`   - Films non trouvés: ${films.length - foundCount}`);
}

// Lancer l'enrichissement
enrichAllFilms().catch(console.error);
