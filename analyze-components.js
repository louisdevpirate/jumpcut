#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Configuration
const PROJECT_ROOT = process.cwd();
const OUTPUT_FILE = 'COMPONENTS_ANALYSIS.md';

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

// Fonction pour analyser un composant
function analyzeComponent(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const stats = fs.statSync(filePath);
  
  // Extraire les imports
  const imports = [];
  const importRegex = /import\s+(?:{[^}]+}|\w+|\*\s+as\s+\w+)\s+from\s+['"]([^'"]+)['"]/g;
  let match;
  while ((match = importRegex.exec(content)) !== null) {
    imports.push(match[1]);
  }
  
  // Extraire les exports
  const exports = [];
  const exportRegex = /export\s+(?:default\s+)?(?:function|const|class|interface|type)\s+(\w+)/g;
  while ((match = exportRegex.exec(content)) !== null) {
    exports.push(match[1]);
  }
  
  // Extraire les composants React
  const components = [];
  const componentRegex = /(?:function|const)\s+(\w+)\s*(?:\([^)]*\)\s*)?(?:=>\s*)?(?:{|\()/g;
  while ((match = componentRegex.exec(content)) !== null) {
    if (match[1].match(/^[A-Z]/)) {
      components.push(match[1]);
    }
  }
  
  // Extraire les hooks utilisés
  const hooks = [];
  const hookRegex = /use[A-Z]\w+/g;
  while ((match = hookRegex.exec(content)) !== null) {
    hooks.push(match[0]);
  }
  
  // Extraire les props
  const props = [];
  const propsRegex = /interface\s+(\w+Props)\s*{([^}]+)}/g;
  while ((match = propsRegex.exec(content)) !== null) {
    const propInterface = match[1];
    const propContent = match[2];
    const propMatches = propContent.match(/(\w+)(?:\?)?\s*:\s*([^;,\n]+)/g);
    if (propMatches) {
      props.push({
        interface: propInterface,
        properties: propMatches.map(p => p.trim())
      });
    }
  }
  
  return {
    path: filePath,
    size: stats.size,
    lines: content.split('\n').length,
    imports,
    exports,
    components,
    hooks: [...new Set(hooks)],
    props,
    content
  };
}

// Fonction pour scanner les composants
function scanComponents(dirPath, basePath = '') {
  const components = [];
  
  try {
    const entries = fs.readdirSync(dirPath, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(dirPath, entry.name);
      const relativePath = path.join(basePath, entry.name);
      
      if (entry.isDirectory()) {
        const subComponents = scanComponents(fullPath, relativePath);
        components.push(...subComponents);
      } else if (entry.name.endsWith('.tsx') || entry.name.endsWith('.ts')) {
        const analysis = analyzeComponent(fullPath);
        components.push({
          ...analysis,
          relativePath,
          isComponent: relativePath.includes('/components/'),
          isPage: relativePath.includes('/app/') && relativePath.endsWith('/page.tsx'),
          isAPI: relativePath.includes('/api/'),
          isLayout: relativePath.includes('/layout.tsx')
        });
      }
    }
  } catch (error) {
    log(`Erreur lors du scan de ${dirPath}: ${error.message}`, 'red');
  }
  
  return components;
}

// Fonction pour générer le Markdown
function generateComponentsMarkdown(components) {
  let markdown = `# 🧩 Analyse des Composants - JumpCut

## 📊 Vue d'ensemble

- **${components.length}** fichiers analysés
- **${components.filter(c => c.isComponent).length}** composants React
- **${components.filter(c => c.isPage).length}** pages
- **${components.filter(c => c.isAPI).length}** routes API
- **${components.filter(c => c.isLayout).length}** layouts

---

## 🧩 Composants React

`;

  const reactComponents = components.filter(c => c.isComponent);
  
  reactComponents.forEach(comp => {
    markdown += `### \`${comp.relativePath}\`
- **Taille**: ${comp.size} bytes (${comp.lines} lignes)
- **Exports**: ${comp.exports.join(', ') || 'Aucun'}
- **Composants**: ${comp.components.join(', ') || 'Aucun'}
- **Hooks**: ${comp.hooks.join(', ') || 'Aucun'}
- **Props interfaces**: ${comp.props.map(p => p.interface).join(', ') || 'Aucune'}

#### Imports
\`\`\`
${comp.imports.slice(0, 10).join('\n')}${comp.imports.length > 10 ? '\n...' : ''}
\`\`\`

#### Props
${comp.props.map(p => `
**${p.interface}**:
\`\`\`typescript
${p.properties.join('\n')}
\`\`\`
`).join('')}

---

`;
  });

  markdown += `
## 📄 Pages

`;

  const pages = components.filter(c => c.isPage);
  
  pages.forEach(page => {
    markdown += `### \`${page.relativePath}\`
- **Taille**: ${page.size} bytes (${page.lines} lignes)
- **Hooks**: ${page.hooks.join(', ') || 'Aucun'}
- **Imports principaux**: ${page.imports.slice(0, 5).join(', ')}

`;
  });

  markdown += `
## 🔌 API Routes

`;

  const apiRoutes = components.filter(c => c.isAPI);
  
  apiRoutes.forEach(route => {
    markdown += `### \`${route.relativePath}\`
- **Taille**: ${route.size} bytes (${route.lines} lignes)
- **Méthodes HTTP**: ${extractHTTPMethods(route.content).join(', ') || 'Aucune'}

`;
  });

  markdown += `
## 📈 Statistiques des dépendances

### Imports les plus utilisés
`;

  // Compter les imports
  const importCounts = {};
  components.forEach(comp => {
    comp.imports.forEach(imp => {
      importCounts[imp] = (importCounts[imp] || 0) + 1;
    });
  });

  const sortedImports = Object.entries(importCounts)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 20);

  sortedImports.forEach(([importPath, count]) => {
    markdown += `- **\`${importPath}\`**: ${count} utilisations\n`;
  });

  markdown += `
### Hooks les plus utilisés
`;

  // Compter les hooks
  const hookCounts = {};
  components.forEach(comp => {
    comp.hooks.forEach(hook => {
      hookCounts[hook] = (hookCounts[hook] || 0) + 1;
    });
  });

  const sortedHooks = Object.entries(hookCounts)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 10);

  sortedHooks.forEach(([hook, count]) => {
    markdown += `- **\`${hook}\`**: ${count} utilisations\n`;
  });

  markdown += `
---

*Analyse générée le ${new Date().toLocaleDateString('fr-FR')}*
`;

  return markdown;
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

// Fonction principale
function main() {
  log('🚀 Analyse des composants JumpCut...', 'cyan');
  
  try {
    // Scanner les composants
    log('🧩 Scan des composants...', 'yellow');
    const components = scanComponents(path.join(PROJECT_ROOT, 'src'));
    
    // Générer le Markdown
    log('📝 Génération du Markdown...', 'yellow');
    const markdown = generateComponentsMarkdown(components);
    
    // Écrire le fichier
    fs.writeFileSync(OUTPUT_FILE, markdown, 'utf8');
    
    log(`✅ Analyse des composants générée: ${OUTPUT_FILE}`, 'green');
    log(`📊 Statistiques:`, 'blue');
    log(`   - ${components.length} fichiers analysés`, 'blue');
    log(`   - ${components.filter(c => c.isComponent).length} composants`, 'blue');
    log(`   - ${components.filter(c => c.isPage).length} pages`, 'blue');
    
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
