const fs = require('fs');
const path = require('path');
const MarkdownIt = require('markdown-it');
const markdownItAnchor = require('markdown-it-anchor');

// Initialize markdown parser with plugins
const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true
}).use(markdownItAnchor);

// Configuration
const DIST_DIR = path.join(__dirname, 'dist');
const TEMPLATE_PATH = path.join(__dirname, 'template.html');
const CSS_PATH = path.join(__dirname, 'styles.css');

// Ensure dist directory exists
function ensureDistDir() {
  if (!fs.existsSync(DIST_DIR)) {
    fs.mkdirSync(DIST_DIR, { recursive: true });
  }
}

// Get all markdown files
function getMarkdownFiles() {
  const files = fs.readdirSync(__dirname);
  return files
    .filter(file => file.endsWith('.md'))
    .map(file => ({
      filename: file,
      path: path.join(__dirname, file),
      title: file.replace('.md', '').replace(/_/g, ' ')
    }));
}

// Read template
function readTemplate() {
  if (!fs.existsSync(TEMPLATE_PATH)) {
    // Default template if template.html doesn't exist
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{{TITLE}}</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <nav class="navbar">
    <div class="nav-container">
      <h1 class="nav-title">Adlington New Town Documentation</h1>
      {{NAV_MENU}}
    </div>
  </nav>
  <main class="container">
    {{CONTENT}}
  </main>
  <footer class="footer">
    <div class="container">
      <p>&copy; 2025 Adlington New Town Documentation. All rights reserved.</p>
    </div>
  </footer>
</body>
</html>`;
  }
  return fs.readFileSync(TEMPLATE_PATH, 'utf-8');
}

// Generate navigation menu
function generateNavMenu(pages, currentPage) {
  let nav = '<ul class="nav-menu">\n';
  nav += '  <li><a href="index.html">Home</a></li>\n';
  
  pages.forEach(page => {
    const outputFilename = page.filename.replace('.md', '.html');
    const isActive = currentPage === outputFilename;
    const activeClass = isActive ? ' class="active"' : '';
    nav += `  <li><a href="${outputFilename}"${activeClass}>${page.title}</a></li>\n`;
  });
  
  nav += '</ul>';
  return nav;
}

// Convert markdown file to HTML
function convertMarkdownToHtml(markdownFile, allPages) {
  const content = fs.readFileSync(markdownFile.path, 'utf-8');
  const htmlContent = md.render(content);
  const template = readTemplate();
  const outputFilename = markdownFile.filename.replace('.md', '.html');
  
  const navMenu = generateNavMenu(allPages, outputFilename);
  
  const html = template
    .replace('{{TITLE}}', markdownFile.title)
    .replace('{{NAV_MENU}}', navMenu)
    .replace('{{CONTENT}}', htmlContent);
  
  const outputPath = path.join(DIST_DIR, outputFilename);
  fs.writeFileSync(outputPath, html);
  console.log(`✓ Generated: ${outputFilename}`);
}

// Create index/homepage
function createIndexPage(pages) {
  const template = readTemplate();
  const navMenu = generateNavMenu(pages, 'index.html');
  
  let indexContent = '<div class="home">\n';
  indexContent += '  <h1>Adlington New Town Documentation</h1>\n';
  indexContent += '  <p class="subtitle">Documentation and analysis of the proposed Adlington New Town development</p>\n';
  indexContent += '  <div class="page-list">\n';
  indexContent += '    <h2>Available Pages</h2>\n';
  indexContent += '    <ul class="page-links">\n';
  
  pages.forEach(page => {
    const outputFilename = page.filename.replace('.md', '.html');
    indexContent += `      <li>\n`;
    indexContent += `        <a href="${outputFilename}">\n`;
    indexContent += `          <h3>${page.title}</h3>\n`;
    indexContent += `          <p>Click to read more...</p>\n`;
    indexContent += `        </a>\n`;
    indexContent += `      </li>\n`;
  });
  
  indexContent += '    </ul>\n';
  indexContent += '  </div>\n';
  indexContent += '</div>\n';
  
  const html = template
    .replace('{{TITLE}}', 'Home - Adlington New Town Documentation')
    .replace('{{NAV_MENU}}', navMenu)
    .replace('{{CONTENT}}', indexContent);
  
  const outputPath = path.join(DIST_DIR, 'index.html');
  fs.writeFileSync(outputPath, html);
  console.log('✓ Generated: index.html');
}

// Copy CSS file
function copyCssFile() {
  if (fs.existsSync(CSS_PATH)) {
    const destPath = path.join(DIST_DIR, 'styles.css');
    fs.copyFileSync(CSS_PATH, destPath);
    console.log('✓ Copied: styles.css');
  } else {
    console.warn('⚠ Warning: styles.css not found, creating default styles');
    createDefaultCss();
  }
}

// Create default CSS if styles.css doesn't exist
function createDefaultCss() {
  const defaultCss = `/* Default styles will be created by styles.css */`;
  const destPath = path.join(DIST_DIR, 'styles.css');
  fs.writeFileSync(destPath, defaultCss);
}

// Main build function
function build() {
  console.log('🔨 Building static website...\n');
  
  // Ensure dist directory exists
  ensureDistDir();
  
  // Get all markdown files
  const pages = getMarkdownFiles();
  
  if (pages.length === 0) {
    console.error('❌ Error: No markdown files found in the root directory!');
    process.exit(1);
  }
  
  console.log(`Found ${pages.length} markdown file(s):\n`);
  pages.forEach(page => console.log(`  - ${page.filename}`));
  console.log('');
  
  // Create homepage
  createIndexPage(pages);
  
  // Convert each markdown file to HTML
  pages.forEach(page => {
    convertMarkdownToHtml(page, pages);
  });
  
  // Copy CSS
  copyCssFile();
  
  console.log('\n✅ Build complete! Website generated in the dist/ folder.');
}

// Run build
build();
