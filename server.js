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
    if (error.code === 'ENOENT') {
      // File doesn't exist, initialize it
      initializeViewsData();
      return { views: 0 };
    }
    console.error('Error reading views data:', error);
    throw error;
  }
}

// Write views count to file
function saveViews(viewsData) {
  try {
    fs.writeFileSync(VIEWS_FILE, JSON.stringify(viewsData, null, 2));
    return true;
  } catch (error) {
    console.error('Error saving views data:', error);
    throw error;
  }
}

// GET /api/views - Returns the current view count
app.get('/api/views', (req, res) => {
  try {
    const data = getViews();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve view count' });
  }
});

// POST /api/views - Increments the view count
app.post('/api/views', (req, res) => {
  try {
    const data = getViews();
    data.views += 1;
    saveViews(data);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update view count' });
  }
});

// Initialize and start server
initializeViewsData();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`API available at /api/views`);
});
