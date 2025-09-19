// Configuration TMDb
export const TMDB_CONFIG = {
  API_KEY: process.env.TMDB_API_KEY || '292dd44388a7a411723b8465ae51f35a',
  BASE_URL: 'https://api.themoviedb.org/3',
  IMAGE_BASE_URL: 'https://image.tmdb.org/t/p',
  IMAGE_SIZES: {
    POSTER: 'w500',
    BACKDROP: 'w1280',
    PROFILE: 'w185'
  }
};

// Instructions pour obtenir une clé API TMDb :
// 1. Créez un compte sur https://www.themoviedb.org/
// 2. Allez dans Settings > API
// 3. Demandez une clé API (gratuite)
// 4. Créez un fichier .env.local avec : TMDB_API_KEY=votre-clé-ici
