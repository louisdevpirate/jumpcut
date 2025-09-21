# 🛣️ Structure des Routes - JumpCut

## 📄 Pages principales

- **`actors/[id]`** **[DYNAMIQUE]** *(id)*
  - Fichier: `actors/[id]/page.tsx`
- **`actors`**
  - Fichier: `actors/page.tsx`
- **`badges`**
  - Fichier: `badges/page.tsx`
- **`directors/[id]`** **[DYNAMIQUE]** *(id)*
  - Fichier: `directors/[id]/page.tsx`
- **`directors`**
  - Fichier: `directors/page.tsx`
- **`films/[id]`** **[DYNAMIQUE]** *(id)*
  - Fichier: `films/[id]/page.tsx`
- **`films`**
  - Fichier: `films/page.tsx`
- **`/`**
  - Fichier: `layout.tsx`
- **`movie/[id]`** **[DYNAMIQUE]** *(id)*
  - Fichier: `movie/[id]/page.tsx`
- **`my-list`**
  - Fichier: `my-list/page.tsx`
- **`/`**
  - Fichier: `page.tsx`
- **`personalities`**
  - Fichier: `personalities/page.tsx`
- **`search/[id]`** **[DYNAMIQUE]** *(id)*
  - Fichier: `search/[id]/page.tsx`
- **`stats`**
  - Fichier: `stats/page.tsx`
- **`wishlist`**
  - Fichier: `wishlist/page.tsx`

## 🔌 API Routes

- **`/api/films/[id]`** **[DYNAMIQUE]** *(id)* **[PUT, POST]**
  - Fichier: `/api/films/[id]/route.ts`
- **`/api/films`** **[GET, POST]**
  - Fichier: `/api/films/route.ts`
- **`/api/statistics`** **[GET]**
  - Fichier: `/api/statistics/route.ts`
- **`/api/tmdb/movie/[id]/recommendations`** **[DYNAMIQUE]** *(id)* **[GET]**
  - Fichier: `/api/tmdb/movie/[id]/recommendations/route.ts`
- **`/api/tmdb/movie/[id]`** **[DYNAMIQUE]** *(id)* **[GET]**
  - Fichier: `/api/tmdb/movie/[id]/route.ts`
- **`/api/tmdb/person/[id]/popular-movies`** **[DYNAMIQUE]** *(id)* **[GET]**
  - Fichier: `/api/tmdb/person/[id]/popular-movies/route.ts`
- **`/api/tmdb/person/[id]`** **[DYNAMIQUE]** *(id)* **[GET]**
  - Fichier: `/api/tmdb/person/[id]/route.ts`
- **`/api/tmdb-proxy`** **[GET]**
  - Fichier: `/api/tmdb-proxy/route.ts`

---

## 📊 Résumé

- **15** pages principales
- **8** routes API
- **5** pages dynamiques
- **5** API routes dynamiques

---

*Généré le 21/09/2025*
