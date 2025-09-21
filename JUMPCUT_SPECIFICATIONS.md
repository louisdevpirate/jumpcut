# 🎬 JumpCut - Cahier des Charges Complet

## 📋 Vue d'ensemble du projet

**JumpCut** est une cinémathèque personnelle moderne qui doit évoluer vers une plateforme professionnelle, performante et potentiellement rentable. Le projet combine trois aspects :

1. **Cinémathèque critique personnelle** - Ajout/notation/critique ultra-rapide
2. **Plateforme d'exploration** - Type Netflix/Letterboxd avec genres, recommandations, personnalités
3. **Vitrine évolutive** - Stats, partage, SEO, affiliation, futur multi-utilisateurs

---

## 🏗️ Architecture & Données

### 📊 Schéma de données recommandé

#### `films.json` - Structure optimisée
```json
{
  "tmdbId": 123,
  "title": "Inception",
  "year": 2010,
  "posterUrl": "https://image.tmdb.org/t/p/w500/xyz.jpg",
  "dateWatched": "2025-09-01",
  "rating5": 4.5,
  "quickReview140": "Brillant mais un peu froid.",
  "createdAt": "2025-01-01T00:00:00Z",
  "updatedAt": "2025-01-01T00:00:00Z",
  "overrides": {
    "posterUrl": null,
    "title": null,
    "year": null
  }
}
```

#### `lists.json` - Gestion des listes
```json
{
  "id": "wishlist",
  "items": [123, 456, 789]
}
```

#### `people.json` - Personnalités (optionnel)
```json
{
  "tmdbId": 456,
  "name": "Christopher Nolan",
  "role": "director",
  "photoUrl": "...",
  "stats": { "seenCount": 7, "totalCount": 12 }
}
```

### 🔧 Architecture technique

- **Proxy TMDb** côté serveur (API routes) → éviter d'exposer la clé
- **Cache edge** (s-maxage=3600, stale-while-revalidate=86400) pour toutes les réponses
- **Normalisation** par ID TMDb
- **JSON local évolutif** → prêt à migrer vers base relationnelle (SQLite, Supabase)

### 🎯 Désambiguïsation

Si la recherche renvoie plusieurs films proches → afficher modale avec :
- Titre VO/VF, année, pays, affiche
- Ne rien ajouter si l'utilisateur ne choisit pas → éviter erreurs type "Ne coupez pas"

---

## 🚀 Performance & Architecture Front

### 📈 Optimisations critiques

#### SSG/ISR
- Toutes les pages populaires et fiches film/personne statiques avec revalidation
- Streaming RSC (App Router) pour résultats partiels instantanés

#### Images
- `<Image>` Next.js obligatoire
- Tailles TMDb adaptées : w200 pour listes, w500 pour fiches
- Lazy loading systématique
- BlurHash/LQIP pour placeholder

#### Virtualisation & UX
- `react-window` pour grilles longues (Ma Liste, Personnalités)
- Skeletons partout (listes, fiches, filmographie)
- Bundle audit via `next-bundle-analyzer`
- Supprimer imports en double
- Lazy-load composants lourds (charts, éditeurs)

#### Network
- Preconnect TMDb + preload fonts/images hero

#### Budgets Web Vitals
- **LCP** < 2,5s
- **CLS** ≈ 0
- **JS** < 250 KB init

---

## 🎨 UX/UI & Fonctionnalités

### 1. Ajout / Critique ultra-rapide

#### Bouton "Critique rapide"
- Sur chaque carte (résultats recherche, fiches, Ma Liste)
- Inline form → étoiles (0,5 à 5) + champ 140 caractères
- Optimistic update + toast "Ajouté"
- **Supprimer** le système points positifs/négatifs
- Correction manuelle : bouton Modifier sur chaque film

### 2. Navigation & Information Architecture

#### Accueil/Films
- Sections horizontales type Netflix (populaire, en salles, à venir, genres, recos)

#### Ma Liste
- Films vus (JSON)
- Pagination (50 max/page)
- Tri : alphabétique, année, date visionnage, note
- Recherche locale (fuzzy)
- Vue grille d'affiches / liste compacte (toggle)

#### Wishlist
- Films à voir
- Ajouter depuis recherche ou fiche film
- Conversion en "Vu" en un clic → déplacement Ma Liste

#### Personnalités (fusion Acteurs + Réalisateurs)
- Recherche par nom
- Pagination (20/page)
- Tri (alphabétique / plus vus)
- Carte = photo + nom + films vus / total + % complétion

#### Fiche Personne
- Photo, bio, barre complétion
- Filmographie paginée (20/page)
- Badge ✅ si vu
- Afficher ta note si dispo

### 3. Fiche Film pro

#### Structure
- En-tête : affiche gauche, méta droite (titre, année, réal, top cast, genres, durée, pays)
- Synopsis
- Ta note + critique 140 → au-dessus du pli
- Section recommandations (TMDb)
- Bouton "Ajouter Wishlist" ou "Vu"
- Option champ citation (facultatif)

### 4. Recherche

#### Globale (navbar)
- Multi-search TMDb

#### Locale (Ma Liste)
- Fuzzy titre/année/réal

#### Désambiguïsation
- Modale si collision

### 5. Accessibilité & Clavier

#### Focus states
- Visibles sur tous les éléments interactifs

#### Labels ARIA
- Pour étoiles et composants complexes

#### Raccourcis clavier
- `r` = ouvrir critique rapide
- `+` = ajouter 0,5 étoile
- `w` = toggle Wishlist/Vu

---

## 📊 Stats & Gamification

### Page /stats
- Nombre total films vus
- Répartition par genres
- Répartition par décennies
- Classement réalisateurs + acteurs les plus vus
- Note moyenne par réalisateur

### Badges
- "10 films de Nolan vus"
- "20 films des années 70"
- "Top 50 IMDb complété 40%"

### Objectifs personnalisés
- "Voir 5 films japonais 70s"
- "Compléter 50% de Scorsese"

---

## 📈 SEO & Ouverture publique

### SEO technique
- `<title>` dynamique
- Meta description
- Open Graph + Twitter Cards
- Canonical, sitemap.xml, robots.txt
- JSON-LD : Movie, Review, Person

### i18n
- Routes FR/EN, hreflang

### Pages piliers
- Guides par décennie/genre

### RSS/Atom
- Critiques récentes

### Newsletter (si public)
- Récap hebdo

---

## 💰 Monétisation (optionnel futur)

### Affiliation
- "Où regarder ?" (JustWatch API ou liens Amazon/iTunes)
- Lien vers Blu-ray/4K Amazon

### Sponsoring
- Studios/festivals (bannières light)

### Premium (multi-utilisateurs)
- Export PDF/CSV
- Stats avancées
- Listes collaboratives

---

## 🛡️ Légal & conformité

- Respect TMDb (attribution obligatoire)
- Ne pas exposer clé API client-side
- RGPD : si comptes utilisateurs → page vie privée, cookies, consentement

---

## 🔍 Analytics & Mesure

### Web Vitals RUM
- Vercel Analytics ou GA4

### Événements clés
- `add_to_list`
- `quick_review_submit`
- `add_to_wishlist`
- `search_submit`
- `recommendation_click`
- `disambiguation_select`

### Funnel suivi
- Recherche → fiche → ajout critique

---

## 🧑‍💻 Qualité logicielle

### Validation
- Zod pour inputs API

### Tests
- Unit (rating, parsers)
- E2E (Playwright) : critique rapide, pagination, désambiguïsation

### CI/CD
- Lint + typecheck + test sur PR
- Preview Vercel

### Monitoring
- Sentry pour erreurs front + API

### Feature flags
- Badges, newsletter

---

## 📝 Roadmap (ordre d'implémentation)

### Phase 1 - Critique rapide (Priorité 1)
1. **Critique rapide inline** + demi-étoiles
2. **Désambiguïsation recherche** + correction manuelle

### Phase 2 - Ma Liste optimisée (Priorité 2)
3. **Ma Liste** → pagination, tri, recherche, vue compacte

### Phase 3 - Personnalités (Priorité 3)
4. **Personnalités fusionnées** + pagination + tri

### Phase 4 - Fiche film pro (Priorité 4)
5. **Fiche film pro** (critique + recos visibles)

### Phase 5 - Wishlist (Priorité 5)
6. **Wishlist** + conversion Vu

### Phase 6 - Performance (Priorité 6)
7. **Performance** : Next/Image, cache edge, skeletons, virtualisation

### Phase 7 - Stats/Badges (Priorité 7)
8. **Stats/Badges** + page /stats

### Phase 8 - Recommandations (Priorité 8)
9. **Recommandations hybrides** (TMDb + pondération historique)

### Phase 9 - SEO (Priorité 9)
10. **SEO complet** (si public)

### Phase 10 - Monétisation (Priorité 10)
11. **Monétisation** (affiliation, sponsoring)

### Phase 11 - Qualité (Priorité 11)
12. **Tests E2E** + CI/CD + Sentry

---

## 🎯 Questions spécifiques pour ChatGPT

### 🔧 Problèmes techniques actuels

1. **Erreurs 404** sur les images placeholder et fonts locales
   - Images : `/placeholder-poster.jpg` et `/placeholder-person.jpg`
   - Fonts : `/fonts/Satoshi-Regular.woff2` et `/fonts/Roboto-Regular.woff2`

2. **Rate limiting** de l'API TMDb (erreurs 429)
   - Besoin d'un système de cache et de retry intelligent

3. **Console errors** Next.js 15 (params awaiting)
   - Corriger les routes API pour utiliser `await params`

4. **Performance** de chargement des pages Personnalités
   - Optimiser le chargement des données TMDb

### 🎨 Améliorations UX/UI demandées

1. **Critique rapide inline** avec demi-étoiles
2. **Désambiguïsation** de recherche avec modale
3. **Pagination** et virtualisation pour les listes longues
4. **Skeletons** de chargement partout
5. **Optimisation des images** avec Next/Image
6. **Cache edge** pour les API TMDb

### ⚡ Optimisations de performance

1. **Bundle analysis** et optimisation
2. **Lazy loading** des composants lourds
3. **Preloading** intelligent des données critiques
4. **Service Worker** pour le cache offline

### 🎬 Fonctionnalités avancées

1. **Système de badges** et gamification
2. **Recommandations hybrides** (TMDb + historique)
3. **Export/Import** de données
4. **Mode sombre/clair** avec persistance

---

## 🚀 Résultat attendu

Merci de fournir :

1. **Analyse détaillée** de l'architecture actuelle vs spécifications
2. **Solutions concrètes** avec exemples de code pour chaque phase
3. **Roadmap d'amélioration** priorisée selon le cahier des charges
4. **Recommandations** spécifiques au design et UX
5. **Optimisations** de performance détaillées
6. **Bonnes pratiques** Next.js 15 et React 18

**Objectif** : Transformer JumpCut en une cinémathèque de niveau professionnel avec une UX exceptionnelle et une architecture évolutive ! 🎬✨

---

*Cahier des charges généré le ${new Date().toLocaleDateString('fr-FR')} à ${new Date().toLocaleTimeString('fr-FR')}*
