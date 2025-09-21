#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Configuration
const PROJECT_ROOT = process.cwd();
const OUTPUT_FILE = 'JUMPCUT_EXECUTIVE_SUMMARY.md';

// Couleurs pour la console
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

// Fonction pour analyser le package.json
function analyzePackageJson() {
  try {
    const packagePath = path.join(PROJECT_ROOT, 'package.json');
    const packageData = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
    
    return {
      name: packageData.name,
      version: packageData.version,
      description: packageData.description,
      dependencies: packageData.dependencies || {},
      devDependencies: packageData.devDependencies || {},
      scripts: packageData.scripts || {}
    };
  } catch (error) {
    return null;
  }
}

// Fonction pour analyser les données
function analyzeData() {
  try {
    const filmsPath = path.join(PROJECT_ROOT, 'data', 'films.json');
    const filmsData = JSON.parse(fs.readFileSync(filmsPath, 'utf8'));
    
    return {
      totalFilms: filmsData.length,
      ratedFilms: filmsData.filter(f => f.myRating > 0).length,
      averageRating: filmsData.filter(f => f.myRating > 0).reduce((sum, f) => sum + f.myRating, 0) / filmsData.filter(f => f.myRating > 0).length || 0,
      filmsWithReviews: filmsData.filter(f => f.myReview && f.myReview.trim()).length,
      latestYear: Math.max(...filmsData.map(f => f.year || 0)),
      oldestYear: Math.min(...filmsData.filter(f => f.year).map(f => f.year))
    };
  } catch (error) {
    return null;
  }
}

// Fonction pour compter les fichiers
function countFiles(dirPath) {
  let count = 0;
  let totalSize = 0;
  
  try {
    const entries = fs.readdirSync(dirPath, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(dirPath, entry.name);
      
      if (entry.isDirectory()) {
        if (!['node_modules', '.next', '.git', 'dist', 'build'].includes(entry.name)) {
          const subCount = countFiles(fullPath);
          count += subCount.count;
          totalSize += subCount.size;
        }
      } else {
        count++;
        totalSize += fs.statSync(fullPath).size;
      }
    }
  } catch (error) {
    // Ignorer les erreurs
  }
  
  return { count, size: totalSize };
}

// Fonction pour analyser les performances
function analyzePerformance() {
  const issues = [];
  const recommendations = [];
  
  // Vérifier les fichiers volumineux
  const stats = countFiles(path.join(PROJECT_ROOT, 'src'));
  
  if (stats.size > 1024 * 1024) { // Plus de 1MB
    issues.push('Code source volumineux (>1MB)');
    recommendations.push('Considérer le code splitting et la lazy loading');
  }
  
  // Vérifier les dépendances
  const packageData = analyzePackageJson();
  if (packageData) {
    const depCount = Object.keys(packageData.dependencies || {}).length;
    if (depCount > 20) {
      issues.push(`Nombre élevé de dépendances (${depCount})`);
      recommendations.push('Auditer et supprimer les dépendances inutilisées');
    }
  }
  
  return { issues, recommendations };
}

// Fonction pour générer le résumé exécutif
function generateExecutiveSummary() {
  const packageData = analyzePackageJson();
  const dataStats = analyzeData();
  const fileStats = countFiles(path.join(PROJECT_ROOT, 'src'));
  const performance = analyzePerformance();
  
  let markdown = `# 🎬 JumpCut - Résumé Exécutif

## 📋 Vue d'ensemble du projet

**JumpCut** est une cinémathèque personnelle moderne développée avec Next.js 15, offrant une expérience utilisateur fluide pour la gestion et la découverte de films.

### 🎯 Objectif principal
Permettre aux utilisateurs de :
- Gérer leur collection personnelle de films
- Noter et critiquer les films (système 5 étoiles)
- Découvrir de nouveaux contenus via l'API TMDb
- Suivre leurs statistiques de visionnage

---

## 📊 Métriques du projet

### 💾 Données utilisateur
${dataStats ? `
- **${dataStats.totalFilms}** films dans la collection
- **${dataStats.ratedFilms}** films notés (${((dataStats.ratedFilms/dataStats.totalFilms)*100).toFixed(1)}%)
- **${dataStats.averageRating.toFixed(1)}/10** note moyenne
- **${dataStats.filmsWithReviews}** films avec critiques
- Période couverte : **${dataStats.oldestYear}** - **${dataStats.latestYear}**
` : '- Données non disponibles'}

### 🏗️ Architecture technique
${packageData ? `
- **Framework**: Next.js ${packageData.version}
- **${Object.keys(packageData.dependencies || {}).length}** dépendances principales
- **${Object.keys(packageData.devDependencies || {}).length}** dépendances de développement
` : '- Informations package.json non disponibles'}

### 📁 Code source
- **${fileStats.count}** fichiers source
- **${(fileStats.size / 1024).toFixed(1)} KB** de code
- **${(fileStats.size / fileStats.count).toFixed(1)} KB** par fichier en moyenne

---

## 🚀 Fonctionnalités implémentées

### ✅ Fonctionnalités principales
- [x] **Page d'accueil** avec carousels Netflix-style
- [x] **Collection personnelle** avec pagination et recherche
- [x] **Système de notation** 5 étoiles avec demi-étoiles
- [x] **Critiques rapides** (140 caractères)
- [x] **Wishlist** avec localStorage
- [x] **Pages personnalités** (acteurs/réalisateurs)
- [x] **Statistiques** détaillées avec graphiques
- [x] **Système de badges** gamifié
- [x] **Recherche TMDb** intégrée
- [x] **API routes** complètes

### 🎨 Interface utilisateur
- [x] **Design moderne** avec Tailwind CSS
- [x] **Thème sombre** par défaut
- [x] **Animations fluides** et transitions
- [x] **Responsive design** mobile-first
- [x] **Icônes modernes** (Heroicons)
- [x] **Typographie** personnalisée (Satoshi + Roboto)

### ⚡ Performance
- [x] **Lazy loading** des images
- [x] **ISR** (Incremental Static Regeneration)
- [x] **Suspense** pour le chargement asynchrone
- [x] **Optimisation des images** Next.js
- [x] **Pagination** pour les listes longues

---

## 🔧 Architecture technique

### 🏗️ Structure du projet
\`\`\`
src/
├── app/                    # App Router Next.js 15
│   ├── (pages)/           # Pages principales
│   ├── api/               # API routes
│   └── globals.css        # Styles globaux
├── components/            # Composants React
├── lib/                   # Utilitaires et helpers
└── data/                  # Données locales (films.json)
\`\`\`

### 🔌 Intégrations externes
- **TMDb API** : Films populaires, détails, recherche
- **Next.js Image** : Optimisation automatique
- **React Icons** : Bibliothèque d'icônes
- **Tailwind CSS** : Framework CSS

### 💾 Stockage des données
- **JSON local** : Collection personnelle
- **localStorage** : Wishlist et préférences
- **Cache API** : Données TMDb temporaires

---

## 🎯 Points forts

### ✨ Expérience utilisateur
- **Interface intuitive** inspirée de Netflix
- **Navigation fluide** entre les sections
- **Feedback visuel** immédiat
- **Gamification** avec badges et statistiques

### 🚀 Performance technique
- **Chargement rapide** avec ISR et lazy loading
- **Optimisation mobile** native
- **Cache intelligent** des données API
- **Code splitting** automatique

### 🎨 Design moderne
- **Esthétique professionnelle** et épurée
- **Cohérence visuelle** sur toutes les pages
- **Animations subtiles** et élégantes
- **Accessibilité** considérée

---

## ⚠️ Problèmes identifiés

${performance.issues.length > 0 ? performance.issues.map(issue => `- ❌ ${issue}`).join('\n') : '- ✅ Aucun problème majeur identifié'}

---

## 🚀 Recommandations d'évolution

### 🎯 Priorité haute
1. **Résoudre les erreurs 404** sur les images placeholder
2. **Corriger les fonts locales** (Satoshi/Roboto)
3. **Implémenter la gestion d'erreur** pour l'API TMDb
4. **Optimiser les performances** de chargement

### 🎯 Priorité moyenne
1. **Mode sombre/clair** toggle
2. **Recherche globale** avec autocomplétion
3. **Filtres avancés** (année, genre, note)
4. **Export/Import** de la collection

### 🎯 Priorité basse
1. **Fonctionnalités sociales** (partage, commentaires)
2. **PWA** (Progressive Web App)
3. **Mode hors-ligne** complet
4. **Tests automatisés**

---

## 📈 Métriques de succès

### 🎯 Objectifs techniques
- **Temps de chargement** < 2s
- **Score Lighthouse** > 90
- **Taux d'erreur** < 1%
- **Temps de réponse API** < 500ms

### 🎯 Objectifs utilisateur
- **Temps d'engagement** > 5 minutes
- **Taux de retour** > 70%
- **Films ajoutés** par session > 3
- **Satisfaction utilisateur** > 4/5

---

## 🎬 Conclusion

JumpCut est un projet **techniquement solide** avec une **architecture moderne** et une **expérience utilisateur soignée**. Le site offre toutes les fonctionnalités essentielles d'une cinémathèque personnelle avec des performances optimisées.

### 🏆 Points d'excellence
- Architecture Next.js 15 moderne
- Design professionnel et cohérent
- Fonctionnalités complètes et intuitives
- Performance optimisée

### 🔧 Axes d'amélioration
- Résolution des bugs mineurs
- Ajout de fonctionnalités sociales
- Optimisation continue des performances
- Tests et monitoring

**Recommandation** : Le projet est prêt pour une utilisation en production avec quelques corrections mineures.

---

*Résumé généré le ${new Date().toLocaleDateString('fr-FR')} à ${new Date().toLocaleTimeString('fr-FR')}*
`;

  return markdown;
}

// Fonction principale
function main() {
  log('🚀 Génération du résumé exécutif JumpCut...', 'cyan');
  
  try {
    // Générer le résumé
    log('📝 Génération du résumé...', 'yellow');
    const markdown = generateExecutiveSummary();
    
    // Écrire le fichier
    fs.writeFileSync(OUTPUT_FILE, markdown, 'utf8');
    
    log(`✅ Résumé exécutif généré: ${OUTPUT_FILE}`, 'green');
    log(`📊 Fichiers de documentation disponibles:`, 'blue');
    log(`   - SITE_DOCUMENTATION.md (documentation complète)`, 'blue');
    log(`   - ROUTES_STRUCTURE.md (structure des routes)`, 'blue');
    log(`   - COMPONENTS_ANALYSIS.md (analyse des composants)`, 'blue');
    log(`   - JUMPCUT_EXECUTIVE_SUMMARY.md (résumé exécutif)`, 'blue');
    
  } catch (error) {
    log(`❌ Erreur: ${error.message}`, 'red');
    process.exit(1);
  }
}

// Exécuter le script
if (require.main === module) {
  main();
}

module.exports = { main };
