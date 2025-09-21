#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Configuration
const PROJECT_ROOT = process.cwd();
const OUTPUT_FILE = 'SITE_DOCUMENTATION.md';

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

// Fonction pour analyser un fichier
function analyzeFile(filePath, relativePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const stats = fs.statSync(filePath);
  
  return {
    path: relativePath,
    size: stats.size,
    lines: content.split('\n').length,
    content: content,
    isComponent: relativePath.includes('/components/'),
    isPage: relativePath.includes('/app/') && relativePath.endsWith('/page.tsx'),
    isAPI: relativePath.includes('/api/'),
    isLayout: relativePath.includes('/layout.tsx'),
    isConfig: relativePath.includes('.config.') || relativePath.includes('.json')
  };
}

// Fonction pour scanner un répertoire
function scanDirectory(dirPath, relativePath = '', depth = 0) {
  const items = [];
  
  try {
    const entries = fs.readdirSync(dirPath, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(dirPath, entry.name);
      const itemRelativePath = path.join(relativePath, entry.name);
      
      if (entry.isDirectory()) {
        // Ignorer certains dossiers
        if (['node_modules', '.next', '.git', 'dist', 'build'].includes(entry.name)) {
          continue;
        }
        
        const subItems = scanDirectory(fullPath, itemRelativePath, depth + 1);
        items.push({
          type: 'directory',
          name: entry.name,
          path: itemRelativePath,
          children: subItems,
          depth
        });
      } else {
        // Analyser les fichiers importants
        if (entry.name.match(/\.(tsx?|jsx?|json|css|md)$/)) {
          const analysis = analyzeFile(fullPath, itemRelativePath);
          items.push({
            type: 'file',
            name: entry.name,
            path: itemRelativePath,
            analysis,
            depth
          });
        }
      }
    }
  } catch (error) {
    log(`Erreur lors du scan de ${dirPath}: ${error.message}`, 'red');
  }
  
  return items.sort((a, b) => {
    if (a.type !== b.type) {
      return a.type === 'directory' ? -1 : 1;
    }
    return a.name.localeCompare(b.name);
  });
}

// Fonction pour extraire les imports et exports
function extractImportsExports(content) {
  const imports = [];
  const exports = [];
  const components = [];
  
  // Extraire les imports
  const importRegex = /import\s+(?:{[^}]+}|\w+|\*\s+as\s+\w+)\s+from\s+['"]([^'"]+)['"]/g;
  let match;
  while ((match = importRegex.exec(content)) !== null) {
    imports.push(match[1]);
  }
  
  // Extraire les exports
  const exportRegex = /export\s+(?:default\s+)?(?:function|const|class|interface|type)\s+(\w+)/g;
  while ((match = exportRegex.exec(content)) !== null) {
    exports.push(match[1]);
  }
  
  // Extraire les composants React
  const componentRegex = /(?:function|const)\s+(\w+)\s*(?:\([^)]*\)\s*)?(?:=>\s*)?(?:{|\()/g;
  while ((match = componentRegex.exec(content)) !== null) {
    if (match[1].match(/^[A-Z]/)) {
      components.push(match[1]);
    }
  }
  
  return { imports, exports, components };
}

// Fonction pour analyser les routes
function analyzeRoutes(items) {
  const routes = [];
  
  function findRoutes(items, basePath = '') {
    for (const item of items) {
      if (item.type === 'file' && item.analysis?.isPage) {
        const routePath = basePath + '/' + item.name.replace('/page.tsx', '');
        routes.push({
          path: routePath,
          file: item.path,
          isDynamic: routePath.includes('[') && routePath.includes(']'),
          hasParams: routePath.match(/\[([^\]]+)\]/g) || []
        });
      } else if (item.type === 'directory') {
        findRoutes(item.children, basePath + '/' + item.name);
      }
    }
  }
  
  findRoutes(items);
  return routes;
}

// Fonction pour analyser les API routes
function analyzeAPIRoutes(items) {
  const apiRoutes = [];
  
  function findAPIRoutes(items, basePath = '') {
    for (const item of items) {
      if (item.type === 'file' && item.analysis?.isAPI) {
        const routePath = '/api' + basePath + '/' + item.name.replace('/route.ts', '');
        apiRoutes.push({
          path: routePath,
          file: item.path,
          methods: extractHTTPMethods(item.analysis.content)
        });
      } else if (item.type === 'directory') {
        findAPIRoutes(item.children, basePath + '/' + item.name);
      }
    }
  }
  
  findAPIRoutes(items);
  return apiRoutes;
}

// Fonction pour extraire les méthodes HTTP
function extractHTTPMethods(content) {
  const methods = [];
  const methodRegex = /export\s+(?:async\s+)?(?:function\s+)?(GET|POST|PUT|DELETE|PATCH|HEAD|OPTIONS)/g;
  let match;
  while ((match = methodRegex.exec(content)) !== null) {
    methods.push(match[1]);
  }
  return methods;
}

// Fonction pour générer le Markdown
function generateMarkdown(items, routes, apiRoutes) {
  let markdown = `# 📚 Documentation JumpCut - Cinémathèque Personnelle

## 🎯 Vue d'ensemble

JumpCut est une cinémathèque personnelle moderne construite avec **Next.js 15**, **Tailwind CSS** et l'**API TMDb**. Le site permet aux utilisateurs de gérer leur collection de films, noter et critiquer les films, et explorer de nouveaux contenus.

### 🛠️ Technologies utilisées

- **Framework**: Next.js 15.5.3 avec Turbopack
- **Styling**: Tailwind CSS
- **API**: TMDb (The Movie Database)
- **Stockage**: JSON local (\`/data/films.json\`)
- **Icons**: React Icons (Heroicons)
- **Fonts**: Satoshi (titres) + Roboto (corps)

---

## 📁 Structure du projet

`;

  // Structure des fichiers
  markdown += `### 🗂️ Arborescence des fichiers

\`\`\`
${generateTreeStructure(items, 0)}
\`\`\`

---

## 🛣️ Routes et Pages

### 📄 Pages principales

`;

  // Routes
  routes.forEach(route => {
    const dynamicInfo = route.isDynamic ? ` **[DYNAMIQUE]**` : '';
    const paramsInfo = route.hasParams.length > 0 ? ` *(${route.hasParams.join(', ')})*` : '';
    markdown += `- **\`${route.path}\`**${dynamicInfo}${paramsInfo}
  - Fichier: \`${route.file}\`
`;
  });

  markdown += `
### 🔌 API Routes

`;

  // API Routes
  apiRoutes.forEach(route => {
    const methodsInfo = route.methods.length > 0 ? ` **[${route.methods.join(', ')}]**` : '';
    markdown += `- **\`${route.path}\`**${methodsInfo}
  - Fichier: \`${route.file}\`
`;
  });

  markdown += `
---

## 🧩 Composants principaux

`;

  // Composants
  const components = [];
  function extractComponents(items) {
    for (const item of items) {
      if (item.type === 'file' && item.analysis?.isComponent) {
        const { imports, exports, components } = extractImportsExports(item.analysis.content);
        components.push({
          name: item.name.replace('.tsx', ''),
          path: item.path,
          imports,
          exports,
          components,
          lines: item.analysis.lines,
          size: item.analysis.size
        });
      } else if (item.type === 'directory') {
        extractComponents(item.children);
      }
    }
  }
  
  extractComponents(items);
  
  components.forEach(comp => {
    markdown += `### \`${comp.name}\`
- **Fichier**: \`${comp.path}\`
- **Taille**: ${comp.size} bytes (${comp.lines} lignes)
- **Exports**: ${comp.exports.join(', ') || 'Aucun'}
- **Composants**: ${comp.components.join(', ') || 'Aucun'}
- **Imports principaux**: ${comp.imports.slice(0, 5).join(', ')}${comp.imports.length > 5 ? '...' : ''}

`;
  });

  markdown += `
---

## 🎨 Fonctionnalités principales

### 🏠 Page d'accueil (\`/\`)
- **Hero Section** avec film en vedette
- **Carousels horizontaux** style Netflix :
  - Populaires
  - Actuellement en salles
  - Tendances
  - À venir
  - Par genre (Action, Drame, Comédie, Horreur)
- **Chargement asynchrone** avec Suspense
- **ISR** (Incremental Static Regeneration) - revalidation toutes les 6h

### 📋 Ma Liste (\`/my-list\`)
- **Collection personnelle** de films vus
- **Pagination** (50 films/page)
- **Recherche locale** et tri
- **Vue grille/liste** toggle
- **Statistiques** personnelles

### 🎬 Films (\`/films/[id]\`)
- **Pages dédiées** aux films de votre collection
- **Notes personnelles** (système 5 étoiles)
- **Critiques** (pros/cons)
- **Films recommandés**
- **Données TMDb** enrichies

### 🎭 Personnalités (\`/personalities\`)
- **Acteurs et réalisateurs** unifiés
- **Filmographies** avec progression
- **Recherche et filtres**
- **Pagination** (24/pages)
- **Top personnalités**

### 🔍 Recherche (\`/search/[id]\`)
- **Détails de films** TMDb
- **Ajout rapide** à la collection
- **Critique rapide** (140 caractères)
- **Wishlist** intégrée

### 📊 Statistiques (\`/stats\`)
- **Métriques personnelles**
- **Distribution par décennie/genre**
- **Top réalisateurs/acteurs**
- **Graphiques** interactifs

### 🏆 Badges (\`/badges\`)
- **Système de gamification**
- **Récompenses** pour l'activité
- **Progression** visuelle

---

## 🔧 Configuration technique

### 📦 Dépendances principales
\`\`\`json
{
  "next": "15.5.3",
  "react": "^18",
  "tailwindcss": "^3.4.0",
  "react-icons": "^5.0.0"
}
\`\`\`

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

*Documentation générée automatiquement le ${new Date().toLocaleDateString('fr-FR')}*
`;

  return markdown;
}

// Fonction pour générer la structure d'arbre
function generateTreeStructure(items, depth) {
  let tree = '';
  const indent = '  '.repeat(depth);
  
  for (const item of items) {
    if (item.type === 'directory') {
      tree += `${indent}📁 ${item.name}/\n`;
      tree += generateTreeStructure(item.children, depth + 1);
    } else {
      const icon = getFileIcon(item.name);
      tree += `${indent}${icon} ${item.name}\n`;
    }
  }
  
  return tree;
}

// Fonction pour obtenir l'icône du fichier
function getFileIcon(filename) {
  if (filename.endsWith('.tsx')) return '⚛️';
  if (filename.endsWith('.ts')) return '🔷';
  if (filename.endsWith('.js')) return '🟨';
  if (filename.endsWith('.json')) return '📄';
  if (filename.endsWith('.css')) return '🎨';
  if (filename.endsWith('.md')) return '📝';
  return '📄';
}

// Fonction principale
function main() {
  log('🚀 Génération de la documentation JumpCut...', 'cyan');
  
  try {
    // Scanner le projet
    log('📁 Scan du projet...', 'yellow');
    const items = scanDirectory(PROJECT_ROOT);
    
    // Analyser les routes
    log('🛣️ Analyse des routes...', 'yellow');
    const routes = analyzeRoutes(items);
    const apiRoutes = analyzeAPIRoutes(items);
    
    // Générer le Markdown
    log('📝 Génération du Markdown...', 'yellow');
    const markdown = generateMarkdown(items, routes, apiRoutes);
    
    // Écrire le fichier
    fs.writeFileSync(OUTPUT_FILE, markdown, 'utf8');
    
    log(`✅ Documentation générée: ${OUTPUT_FILE}`, 'green');
    log(`📊 Statistiques:`, 'blue');
    log(`   - ${routes.length} routes pages`, 'blue');
    log(`   - ${apiRoutes.length} routes API`, 'blue');
    log(`   - ${items.length} éléments racine`, 'blue');
    
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
