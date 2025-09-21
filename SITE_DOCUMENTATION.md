# 📚 Documentation JumpCut - Cinémathèque Personnelle

## 🎯 Vue d'ensemble

JumpCut est une cinémathèque personnelle moderne construite avec **Next.js 15**, **Tailwind CSS** et l'**API TMDb**. Le site permet aux utilisateurs de gérer leur collection de films, noter et critiquer les films, et explorer de nouveaux contenus.

### 🛠️ Technologies utilisées

- **Framework**: Next.js 15.5.3 avec Turbopack
- **Styling**: Tailwind CSS
- **API**: TMDb (The Movie Database)
- **Stockage**: JSON local (`/data/films.json`)
- **Icons**: React Icons (Heroicons)
- **Fonts**: Satoshi (titres) + Roboto (corps)

---

## 📁 Structure du projet

### 🗂️ Arborescence des fichiers

```
📁 data/
  📄 films.json
📁 public/
  📁 font/
    📁 Satoshi_Complete/
      📁 Fonts/
        📁 OTF/
        📁 TTF/
        📁 WEB/
          📁 css/
            🎨 satoshi.css
          📁 fonts/
          📝 README.md
      📁 License/
  📁 images/
📁 scripts/
  🟨 convert-film-list.js
  🟨 enrich-films.js
📁 src/
  📁 app/
    📁 actors/
      📁 [id]/
        ⚛️ page.tsx
      ⚛️ page.tsx
    📁 api/
      📁 films/
        📁 [id]/
          🔷 route.ts
        🔷 route.ts
      📁 statistics/
        🔷 route.ts
      📁 tmdb/
        📁 movie/
          📁 [id]/
            📁 recommendations/
              🔷 route.ts
            🔷 route.ts
        📁 person/
          📁 [id]/
            📁 popular-movies/
              🔷 route.ts
            🔷 route.ts
      📁 tmdb-proxy/
        🔷 route.ts
    📁 badges/
      ⚛️ page.tsx
    📁 directors/
      📁 [id]/
        ⚛️ page.tsx
      ⚛️ page.tsx
    📁 films/
      📁 [id]/
        ⚛️ page.tsx
      ⚛️ page.tsx
    📁 movie/
      📁 [id]/
        ⚛️ page.tsx
    📁 my-list/
      ⚛️ page.tsx
    📁 personalities/
      ⚛️ page.tsx
    📁 search/
      📁 [id]/
        ⚛️ page.tsx
    📁 stats/
      ⚛️ page.tsx
    📁 trending/
    📁 wishlist/
      ⚛️ page.tsx
    🎨 globals.css
    ⚛️ layout.tsx
    ⚛️ page.tsx
  📁 components/
    ⚛️ AccentButton.tsx
    ⚛️ EditFilmButton.tsx
    ⚛️ FilmCard.tsx
    ⚛️ FilmCardClient.tsx
    ⚛️ FilmCarousel.tsx
    ⚛️ FilmDetail.tsx
    ⚛️ FilmEditForm.tsx
    ⚛️ HeroSection.tsx
    ⚛️ Icons.tsx
    ⚛️ LazyImage.tsx
    ⚛️ LoadingSkeleton.tsx
    ⚛️ Navbar.tsx
    ⚛️ OptimizedFilmImage.tsx
    ⚛️ Pagination.tsx
    ⚛️ PersonDetailPage.tsx
    ⚛️ ProgressBar.tsx
    ⚛️ QuickReview.tsx
    ⚛️ QuickReviewButton.tsx
    ⚛️ RecommendedMovies.tsx
    ⚛️ ReviewForm.tsx
    ⚛️ SearchBar.tsx
    ⚛️ Skeleton.tsx
    ⚛️ Skeletons.tsx
    ⚛️ StarRating.tsx
    ⚛️ StarRatingModern.tsx
    ⚛️ VirtualizedFilmGrid.tsx
    ⚛️ WatchedButton.tsx
    ⚛️ WebVitals.tsx
    ⚛️ WishlistButton.tsx
  📁 config/
    🔷 tmdb.ts
  📁 lib/
    🔷 films-client.ts
    🔷 films.ts
    🔷 fonts.ts
    🔷 tmdb.ts
🟨 generate-docs.js
🔷 next-env.d.ts
🔷 next.config.ts
📄 package-lock.json
📄 package.json
📝 README.md
📄 tsconfig.json

```

---

## 🛣️ Routes et Pages

### 📄 Pages principales

- **`/src/app/actors/[id]/page.tsx`** **[DYNAMIQUE]** *([id])*
  - Fichier: `src/app/actors/[id]/page.tsx`
- **`/src/app/actors/page.tsx`**
  - Fichier: `src/app/actors/page.tsx`
- **`/src/app/badges/page.tsx`**
  - Fichier: `src/app/badges/page.tsx`
- **`/src/app/directors/[id]/page.tsx`** **[DYNAMIQUE]** *([id])*
  - Fichier: `src/app/directors/[id]/page.tsx`
- **`/src/app/directors/page.tsx`**
  - Fichier: `src/app/directors/page.tsx`
- **`/src/app/films/[id]/page.tsx`** **[DYNAMIQUE]** *([id])*
  - Fichier: `src/app/films/[id]/page.tsx`
- **`/src/app/films/page.tsx`**
  - Fichier: `src/app/films/page.tsx`
- **`/src/app/movie/[id]/page.tsx`** **[DYNAMIQUE]** *([id])*
  - Fichier: `src/app/movie/[id]/page.tsx`
- **`/src/app/my-list/page.tsx`**
  - Fichier: `src/app/my-list/page.tsx`
- **`/src/app/personalities/page.tsx`**
  - Fichier: `src/app/personalities/page.tsx`
- **`/src/app/search/[id]/page.tsx`** **[DYNAMIQUE]** *([id])*
  - Fichier: `src/app/search/[id]/page.tsx`
- **`/src/app/stats/page.tsx`**
  - Fichier: `src/app/stats/page.tsx`
- **`/src/app/wishlist/page.tsx`**
  - Fichier: `src/app/wishlist/page.tsx`
- **`/src/app/page.tsx`**
  - Fichier: `src/app/page.tsx`

### 🔌 API Routes

- **`/api/src/app/api/films/[id]/route.ts`** **[PUT, POST]**
  - Fichier: `src/app/api/films/[id]/route.ts`
- **`/api/src/app/api/films/route.ts`** **[GET, POST]**
  - Fichier: `src/app/api/films/route.ts`
- **`/api/src/app/api/statistics/route.ts`** **[GET]**
  - Fichier: `src/app/api/statistics/route.ts`
- **`/api/src/app/api/tmdb/movie/[id]/recommendations/route.ts`** **[GET]**
  - Fichier: `src/app/api/tmdb/movie/[id]/recommendations/route.ts`
- **`/api/src/app/api/tmdb/movie/[id]/route.ts`** **[GET]**
  - Fichier: `src/app/api/tmdb/movie/[id]/route.ts`
- **`/api/src/app/api/tmdb/person/[id]/popular-movies/route.ts`** **[GET]**
  - Fichier: `src/app/api/tmdb/person/[id]/popular-movies/route.ts`
- **`/api/src/app/api/tmdb/person/[id]/route.ts`** **[GET]**
  - Fichier: `src/app/api/tmdb/person/[id]/route.ts`
- **`/api/src/app/api/tmdb-proxy/route.ts`** **[GET]**
  - Fichier: `src/app/api/tmdb-proxy/route.ts`

---

## 🧩 Composants principaux


---

## 🎨 Fonctionnalités principales

### 🏠 Page d'accueil (`/`)
- **Hero Section** avec film en vedette
- **Carousels horizontaux** style Netflix :
  - Populaires
  - Actuellement en salles
  - Tendances
  - À venir
  - Par genre (Action, Drame, Comédie, Horreur)
- **Chargement asynchrone** avec Suspense
- **ISR** (Incremental Static Regeneration) - revalidation toutes les 6h

### 📋 Ma Liste (`/my-list`)
- **Collection personnelle** de films vus
- **Pagination** (50 films/page)
- **Recherche locale** et tri
- **Vue grille/liste** toggle
- **Statistiques** personnelles

### 🎬 Films (`/films/[id]`)
- **Pages dédiées** aux films de votre collection
- **Notes personnelles** (système 5 étoiles)
- **Critiques** (pros/cons)
- **Films recommandés**
- **Données TMDb** enrichies

### 🎭 Personnalités (`/personalities`)
- **Acteurs et réalisateurs** unifiés
- **Filmographies** avec progression
- **Recherche et filtres**
- **Pagination** (24/pages)
- **Top personnalités**

### 🔍 Recherche (`/search/[id]`)
- **Détails de films** TMDb
- **Ajout rapide** à la collection
- **Critique rapide** (140 caractères)
- **Wishlist** intégrée

### 📊 Statistiques (`/stats`)
- **Métriques personnelles**
- **Distribution par décennie/genre**
- **Top réalisateurs/acteurs**
- **Graphiques** interactifs

### 🏆 Badges (`/badges`)
- **Système de gamification**
- **Récompenses** pour l'activité
- **Progression** visuelle

---

## 🔧 Configuration technique

### 📦 Dépendances principales
```json
{
  "next": "15.5.3",
  "react": "^18",
  "tailwindcss": "^3.4.0",
  "react-icons": "^5.0.0"
}
```

### ⚙️ Configuration Next.js
- **Turbopack** activé pour le développement
- **ISR** pour les pages films
- **Optimisations CSS** et imports
- **Compression** activée

### 🎨 Styling
- **Tailwind CSS** avec configuration personnalisée
- **Fonts locales** (Satoshi + Roboto)
- **Animations** CSS personnalisées
- **Thème sombre** par défaut

---

## 🚀 Optimisations de performance

### ⚡ Chargement
- **Lazy loading** des images
- **Suspense** pour le chargement asynchrone
- **Pagination** pour les listes longues
- **Batch processing** pour les API calls

### 🖼️ Images
- **Next.js Image** avec optimisation
- **Tailles adaptatives** TMDb
- **Placeholders** blur
- **Lazy loading** avec IntersectionObserver

### 📊 Cache
- **ISR** pour les pages statiques
- **Cache API** TMDb
- **Revalidation** intelligente

---

## 🔮 Suggestions d'évolution

### 🎯 Améliorations UX/UI
1. **Mode sombre/clair** toggle
2. **Recherche globale** avec autocomplétion
3. **Filtres avancés** (année, genre, note)
4. **Comparateur de films**
5. **Listes personnalisées** (à voir, favoris, etc.)

### ⚡ Performance
1. **Virtualisation** des listes longues
2. **Service Worker** pour le cache offline
3. **Preloading** intelligent
4. **Bundle splitting** optimisé

### 🎮 Fonctionnalités sociales
1. **Partage** de listes
2. **Recommandations** entre utilisateurs
3. **Commentaires** sur les films
4. **Système de followers**

### 📱 Mobile
1. **PWA** (Progressive Web App)
2. **Gestures** tactiles
3. **Mode hors-ligne**
4. **Notifications** push

---

## 📝 Notes de développement

### 🐛 Problèmes connus
- **Rate limiting** TMDb API (429 errors)
- **Fonts locales** 404 (Satoshi/Roboto)
- **Images placeholder** manquantes
- **Console errors** Next.js 15 (params awaiting)

### 🔧 Améliorations techniques
- **Error boundaries** pour la robustesse
- **Logging** centralisé
- **Tests** unitaires/intégration
- **CI/CD** pipeline

---

*Documentation générée automatiquement le 21/09/2025*
