const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');
const componentsDir = path.join(srcDir, 'components');
const templatePath = path.join(srcDir, 'index.html');
const outputPath = path.join(__dirname, 'index.html');

function build() {
  console.log('[GYMTELLIGENT Builder] Building index.html...');
  try {
    if (!fs.existsSync(templatePath)) {
      console.error(`Template not found: ${templatePath}`);
      return;
    }
    let template = fs.readFileSync(templatePath, 'utf8');
    
    // Find all <!-- include:component_name --> tags
    const includeRegex = /<!--\s*include:([a-zA-Z0-9_\-]+)\s*-->/g;
    
    // Replace all placeholders
    template = template.replace(includeRegex, (tag, componentName) => {
      const componentPath = path.join(componentsDir, `${componentName}.html`);
      if (fs.existsSync(componentPath)) {
        console.log(`  -> Injecting component: ${componentName}`);
        return fs.readFileSync(componentPath, 'utf8');
      } else {
        console.warn(`[Warning] Component file not found: ${componentPath}`);
        return tag; // Keep placeholder if file doesn't exist
      }
    });
    
    fs.writeFileSync(outputPath, template, 'utf8');
    console.log('[GYMTELLIGENT Builder] Build completed successfully!');
  } catch (error) {
    console.error('[GYMTELLIGENT Builder] Build failed:', error);
  }
}

// Check for watch flag
if (process.argv.includes('--watch')) {
  console.log('[GYMTELLIGENT Builder] Watching for changes in src/...');
  build();
  
  // Watch src/index.html and src/components/
  let fsWait = false;
  const watchCallback = (eventType, filename) => {
    if (filename) {
      if (fsWait) return;
      fsWait = setTimeout(() => {
        fsWait = false;
      }, 150);
      console.log(`[GYMTELLIGENT Builder] ${filename} changed, rebuilding...`);
      build();
    }
  };
  
  fs.watch(templatePath, watchCallback);
  if (fs.existsSync(componentsDir)) {
    fs.watch(componentsDir, { recursive: true }, watchCallback);
  }
} else {
  build();
}
