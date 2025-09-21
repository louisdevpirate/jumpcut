#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Configuration
const PROJECT_ROOT = process.cwd();
const OUTPUT_FILE = 'ROUTES_STRUCTURE.md';

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

// Fonction pour scanner les routes
function scanRoutes(dirPath, basePath = '') {
  const routes = [];
  
  try {
    const entries = fs.readdirSync(dirPath, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(dirPath, entry.name);
      
      if (entry.isDirectory()) {
        // Ignorer certains dossiers
        if (['node_modules', '.next', '.git', 'dist', 'build', 'api'].includes(entry.name)) {
          continue;
        }
        
        const subRoutes = scanRoutes(fullPath, path.join(basePath, entry.name));
        routes.push(...subRoutes);
      } else if (entry.name === 'page.tsx' || entry.name === 'layout.tsx') {
        const routePath = basePath || '/';
        const isDynamic = routePath.includes('[') && routePath.includes(']');
        const params = routePath.match(/\[([^\]]+)\]/g) || [];
        
        routes.push({
          path: routePath,
          file: entry.name,
          isDynamic,
          params: params.map(p => p.slice(1, -1)),
          fullPath: path.join(basePath, entry.name)
        });
      }
    }
  } catch (error) {
    log(`Erreur lors du scan de ${dirPath}: ${error.message}`, 'red');
  }
  
  return routes;
}

// Fonction pour scanner les API routes
function scanAPIRoutes(dirPath, basePath = '/api') {
  const routes = [];
  
  try {
    const entries = fs.readdirSync(dirPath, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(dirPath, entry.name);
      
      if (entry.isDirectory()) {
        const subRoutes = scanAPIRoutes(fullPath, path.join(basePath, entry.name));
        routes.push(...subRoutes);
      } else if (entry.name === 'route.ts') {
        const routePath = basePath;
        const isDynamic = routePath.includes('[') && routePath.includes(']');
        const params = routePath.match(/\[([^\]]+)\]/g) || [];
        
        // Lire le contenu pour extraire les méthodes HTTP
        const content = fs.readFileSync(fullPath, 'utf8');
        const methods = [];
        const methodRegex = /export\s+(?:async\s+)?(?:function\s+)?(GET|POST|PUT|DELETE|PATCH|HEAD|OPTIONS)/g;
        let match;
        while ((match = methodRegex.exec(content)) !== null) {
          methods.push(match[1]);
        }
        
        routes.push({
          path: routePath,
          file: entry.name,
          isDynamic,
          params: params.map(p => p.slice(1, -1)),
          methods,
          fullPath: path.join(basePath, entry.name)
        });
      }
    }
  } catch (error) {
    log(`Erreur lors du scan API de ${dirPath}: ${error.message}`, 'red');
  }
  
  return routes;
}

// Fonction pour générer le Markdown
function generateRoutesMarkdown(pageRoutes, apiRoutes) {
  let markdown = `# 🛣️ Structure des Routes - JumpCut

## 📄 Pages principales

`;

  pageRoutes.forEach(route => {
    const dynamicInfo = route.isDynamic ? ` **[DYNAMIQUE]**` : '';
    const paramsInfo = route.params.length > 0 ? ` *(${route.params.join(', ')})*` : '';
    markdown += `- **\`${route.path}\`**${dynamicInfo}${paramsInfo}
  - Fichier: \`${route.fullPath}\`
`;
  });

  markdown += `
## 🔌 API Routes

`;

  apiRoutes.forEach(route => {
    const dynamicInfo = route.isDynamic ? ` **[DYNAMIQUE]**` : '';
    const paramsInfo = route.params.length > 0 ? ` *(${route.params.join(', ')})*` : '';
    const methodsInfo = route.methods.length > 0 ? ` **[${route.methods.join(', ')}]**` : '';
    markdown += `- **\`${route.path}\`**${dynamicInfo}${paramsInfo}${methodsInfo}
  - Fichier: \`${route.fullPath}\`
`;
  });

  markdown += `
---

## 📊 Résumé

- **${pageRoutes.length}** pages principales
- **${apiRoutes.length}** routes API
- **${pageRoutes.filter(r => r.isDynamic).length}** pages dynamiques
- **${apiRoutes.filter(r => r.isDynamic).length}** API routes dynamiques

---

*Généré le ${new Date().toLocaleDateString('fr-FR')}*
`;

  return markdown;
}

// Fonction principale
function main() {
  log('🚀 Génération de la structure des routes...', 'cyan');
  
  try {
    // Scanner les pages
    log('📄 Scan des pages...', 'yellow');
    const pageRoutes = scanRoutes(path.join(PROJECT_ROOT, 'src', 'app'));
    
    // Scanner les API routes
    log('🔌 Scan des API routes...', 'yellow');
    const apiRoutes = scanAPIRoutes(path.join(PROJECT_ROOT, 'src', 'app', 'api'));
    
    // Générer le Markdown
    log('📝 Génération du Markdown...', 'yellow');
    const markdown = generateRoutesMarkdown(pageRoutes, apiRoutes);
    
    // Écrire le fichier
    fs.writeFileSync(OUTPUT_FILE, markdown, 'utf8');
    
    log(`✅ Structure des routes générée: ${OUTPUT_FILE}`, 'green');
    log(`📊 Statistiques:`, 'blue');
    log(`   - ${pageRoutes.length} pages`, 'blue');
    log(`   - ${apiRoutes.length} API routes`, 'blue');
    
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
