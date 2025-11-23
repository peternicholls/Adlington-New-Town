const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const VIEWS_FILE = path.join(__dirname, 'views-data.json');

// Middleware
app.use(express.json());
app.use(express.static(__dirname));

// Initialize views data file if it doesn't exist
function initializeViewsData() {
  if (!fs.existsSync(VIEWS_FILE)) {
    fs.writeFileSync(VIEWS_FILE, JSON.stringify({ views: 0 }, null, 2));
  }
}

// Read views count from file
function getViews() {
  try {
    const data = fs.readFileSync(VIEWS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading views data:', error);
    return { views: 0 };
  }
}

// Write views count to file
function saveViews(viewsData) {
  try {
    fs.writeFileSync(VIEWS_FILE, JSON.stringify(viewsData, null, 2));
  } catch (error) {
    console.error('Error saving views data:', error);
  }
}

// GET /api/views - Returns the current view count
app.get('/api/views', (req, res) => {
  const data = getViews();
  res.json(data);
});

// POST /api/views - Increments the view count
app.post('/api/views', (req, res) => {
  const data = getViews();
  data.views += 1;
  saveViews(data);
  res.json(data);
});

// Initialize and start server
initializeViewsData();

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`API available at http://localhost:${PORT}/api/views`);
});
