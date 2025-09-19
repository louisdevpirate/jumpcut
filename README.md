# 🎬 Ma Cinémathèque

Une application moderne de gestion de collection de films développée avec Next.js et Tailwind CSS.

## ✨ Fonctionnalités

- **Collection personnelle** : Ajoutez vos films vus avec notes et critiques
- **Intégration TMDb** : Données enrichies automatiquement (affiches, synopsis, acteurs, réalisateurs)
- **Navigation intuitive** : Parcours par films, réalisateurs et acteurs
- **Barres de progression** : Suivez votre avancement dans les filmographies
- **Section "À la une"** : Découvrez les films tendance du moment
- **Design moderne** : Interface élégante avec animations fluides

## 🚀 Installation

1. **Cloner le projet**
   ```bash
   git clone <votre-repo>
   cd jumpcut
   ```

2. **Installer les dépendances**
   ```bash
   npm install
   ```

3. **Configuration de l'API TMDb**
   - Créez un compte sur [TMDb](https://www.themoviedb.org/)
   - Obtenez votre clé API gratuite dans Settings > API
   - Créez un fichier `.env.local` :
     ```env
     TMDB_API_KEY=votre-clé-api-ici
     ```

4. **Lancer le serveur de développement**
   ```bash
   npm run dev
   ```

5. **Ouvrir dans le navigateur**
   ```
   http://localhost:3000
   ```

## 📁 Structure du projet

```
src/
├── app/                    # Pages Next.js
│   ├── films/             # Pages des films
│   ├── actors/            # Pages des acteurs
│   ├── directors/         # Pages des réalisateurs
│   └── layout.tsx         # Layout principal
├── components/            # Composants réutilisables
│   ├── Navbar.tsx         # Navigation
│   ├── FilmCard.tsx       # Carte de film
│   ├── FilmDetail.tsx     # Détail d'un film
│   ├── ProgressBar.tsx    # Barre de progression
│   └── AccentButton.tsx   # Bouton d'accent
├── lib/                   # Utilitaires
│   └── tmdb.ts           # API TMDb
└── config/               # Configuration
    └── tmdb.ts           # Config TMDb
data/
└── films.json            # Données des films
```

## 🎨 Design System

### Palette de couleurs
- **Fond principal** : `bg-neutral-50`
- **Texte principal** : `text-neutral-900`
- **Texte secondaire** : `text-neutral-600`
- **Accent** : `bg-blue-500`
- **Positif** : `bg-green-50`
- **Négatif** : `bg-red-50`

### Animations
- **Fade-in** : Apparition en fondu
- **Slide-in** : Glissement depuis la gauche
- **Scale-in** : Agrandissement progressif
- **Hover effects** : Transformations au survol

## 📊 Structure des données

### Format JSON des films
```json
{
  "id": 1,
  "tmdbId": 27205,
  "title": "Inception",
  "year": 2010,
  "myRating": 9,
  "positives": "Points positifs...",
  "negatives": "Points négatifs...",
  "myReview": "Critique complète...",
  "dateWatched": "2025-01-15"
}
```

## 🔧 API TMDb

L'application utilise l'API TMDb pour enrichir automatiquement les données :

- **Films tendance** : `/trending/movie/week`
- **Détails de film** : `/movie/{id}`
- **Recherche** : `/search/movie`
- **Informations acteur/réalisateur** : `/person/{id}`

## 🎯 Pages disponibles

- **/** : Accueil avec films tendance et statistiques
- **/films** : Liste de tous vos films
- **/films/[id]** : Détail d'un film avec critique
- **/actors** : Liste des acteurs avec filmographies
- **/directors** : Liste des réalisateurs avec filmographies

## 🚀 Déploiement

### Vercel (recommandé)
1. Connectez votre repo GitHub à Vercel
2. Ajoutez la variable d'environnement `TMDB_API_KEY`
3. Déployez automatiquement

### Autres plateformes
```bash
npm run build
npm start
```

## 🛠️ Technologies utilisées

- **Next.js 15** : Framework React
- **Tailwind CSS 4** : Framework CSS
- **TypeScript** : Typage statique
- **TMDb API** : Base de données cinématographique
- **Inter Font** : Typographie moderne

## 📝 Prochaines fonctionnalités

- [ ] Mode sombre
- [ ] Ajout de nouveaux films
- [ ] Système de recherche avancée
- [ ] Export/import de données
- [ ] Statistiques avancées
- [ ] Recommandations personnalisées

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à :
- Signaler des bugs
- Proposer des améliorations
- Ajouter de nouvelles fonctionnalités

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

---

Développé avec ❤️ pour les amateurs de cinéma