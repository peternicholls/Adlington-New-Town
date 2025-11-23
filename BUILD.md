# Build Instructions

This document explains how to build the static website from the Markdown documentation files.

## Overview

This project uses a custom Node.js-based static site generator that converts Markdown files into a complete HTML website with navigation, professional styling, and responsive design.

## Automated Build

The repository includes a GitHub Actions workflow that **automatically builds the static site** whenever:
- Markdown files (`.md`) are modified and committed
- Build scripts or templates are updated

The workflow runs `npm run build` and commits the generated `dist/` folder to the repository, making it ready to serve.

### Manual Trigger

You can also manually trigger the build workflow from the Actions tab on GitHub.

## Prerequisites

- **Node.js** (version 14 or higher)
- **npm** (comes with Node.js)

## Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Build the website:**
   ```bash
   npm run build
   ```

3. **View the website:**
   Open `dist/index.html` in your web browser, or use a local web server:
   ```bash
   # Using Python 3
   cd dist
   python3 -m http.server 8000
   # Then open http://localhost:8000 in your browser
   
   # Or using Node.js http-server (install with: npm install -g http-server)
   cd dist
   http-server
   ```

## Available Scripts

- **`npm run build`** - Generates the static website in the `dist/` folder
- **`npm run clean`** - Removes the `dist/` folder

## How It Works

### Build Process

The build script (`build.js`) performs the following steps:

1. **Scans for Markdown files** - Finds all `.md` files in the root directory
2. **Creates the dist folder** - Ensures the output directory exists
3. **Generates the homepage** - Creates `index.html` with links to all pages
4. **Converts Markdown to HTML** - Uses markdown-it to parse each `.md` file
5. **Adds navigation** - Generates a navigation menu for each page
6. **Applies template** - Wraps content in the HTML template
7. **Copies CSS** - Copies styling to the dist folder

### File Structure

```
.
├── README.md                          # Source markdown file
├── Full_report_Adlington_New_Town.md  # Source markdown file
├── build.js                           # Build script
├── template.html                      # HTML template
├── styles.css                         # CSS stylesheet
├── package.json                       # Dependencies and scripts
├── BUILD.md                           # This file
└── dist/                              # Generated website (git-ignored)
    ├── index.html                     # Homepage
    ├── README.html                    # Converted from README.md
    ├── Full_report_Adlington_New_Town.html  # Converted from Full_report...
    └── styles.css                     # Copied stylesheet
```

### Technologies Used

- **markdown-it** - Markdown parser and HTML generator
- **markdown-it-anchor** - Adds anchor links to headings
- **Node.js** - JavaScript runtime for the build script

## Customization

### Modifying the Template

Edit `template.html` to change the HTML structure. The template uses placeholders:
- `{{TITLE}}` - Page title
- `{{NAV_MENU}}` - Navigation menu
- `{{CONTENT}}` - Main content area

### Modifying Styles

Edit `styles.css` to customize the appearance. The CSS includes:
- Responsive design (mobile, tablet, desktop)
- Navigation styling
- Content typography
- Code block formatting
- Print styles

### Adding New Pages

Simply add a new `.md` file to the root directory and run `npm run build`. The build script will automatically:
- Convert it to HTML
- Add it to the navigation menu
- Link it from the homepage

## Original Markdown Files

The original Markdown files (`README.md` and `Full_report_Adlington_New_Town.md`) remain **completely untouched** by the build process. They serve as the source content and can be edited directly. After making changes, simply run `npm run build` to regenerate the website.

## Troubleshooting

### Build fails with "Cannot find module"

Make sure you've installed dependencies:
```bash
npm install
```

### Navigation menu doesn't show all pages

The build script scans for `.md` files in the root directory only. Make sure your markdown files are in the project root.

### Styles don't appear

Ensure `styles.css` exists in the root directory. The build script will copy it to `dist/styles.css`.

## Development Workflow

1. Edit the Markdown files (`README.md`, `Full_report_Adlington_New_Town.md`)
2. Run `npm run build` to regenerate the website
3. Open `dist/index.html` in a browser to preview changes
4. Repeat as needed

## Publishing

The `dist/` folder contains the complete static website and can be published to any web hosting service:

- **GitHub Pages**: Commit the dist folder or use a GitHub Action
- **Netlify**: Drag and drop the dist folder
- **Vercel**: Import the project and set build command to `npm run build`
- **Any static host**: Upload the contents of the `dist/` folder

## Notes

- The `dist/` folder is excluded from git via `.gitignore`
- The `node_modules/` folder is excluded from git via `.gitignore`
- The build process is idempotent - running it multiple times produces the same output
- All links in the Markdown are preserved in the HTML output
