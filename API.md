# Views Tracker API Documentation

A lightweight, server-side API for tracking and displaying page view counts.

## Overview

This API provides a simple way to track page views using a file-based storage system. No database required.

## Endpoints

### GET /api/views

Returns the current view count.

**Response:**
```json
{
  "views": 123
}
```

**Status Codes:**
- `200 OK` - Successfully retrieved view count

**Example:**
```bash
curl http://localhost:3000/api/views
```

### POST /api/views

Increments the view count by 1 and returns the new count.

**Response:**
```json
{
  "views": 124
}
```

**Status Codes:**
- `200 OK` - Successfully incremented view count

**Example:**
```bash
curl -X POST http://localhost:3000/api/views
```

## Running the Server

### Development

```bash
npm install
npm start
```

The server will start on `http://localhost:3000` by default.

### Production

Set the `PORT` environment variable to specify a different port:

```bash
PORT=8080 npm start
```

## Data Storage

View counts are stored in `views-data.json` in the root directory. This file is automatically created when the server starts if it doesn't exist.

**Format:**
```json
{
  "views": 0
}
```

## Frontend Integration

To display the view count on a web page:

```javascript
// Fetch and display current view count
async function getViewCount() {
  const response = await fetch('/api/views');
  const data = await response.json();
  console.log(`Page views: ${data.views}`);
}

// Increment view count (call on page load)
async function trackPageView() {
  const response = await fetch('/api/views', { method: 'POST' });
  const data = await response.json();
  console.log(`New view count: ${data.views}`);
}
```

## Features

- ✅ Lightweight - No database required
- ✅ Simple file-based storage
- ✅ RESTful API design
- ✅ Easy to deploy and maintain
- ✅ No external dependencies beyond Express.js

## Security Considerations

This is a simple implementation suitable for basic tracking. For production use with high traffic, consider:

- Adding rate limiting to prevent abuse
- Implementing authentication for POST requests
- Using a proper database for better concurrency handling and to avoid race conditions
- Adding request validation and sanitization
- Implementing file locking or atomic operations if staying with file-based storage

**Note:** The current file-based implementation may have race conditions under very high concurrent load. For most use cases (small to medium traffic sites), this is acceptable. For high-traffic scenarios, consider using a database like SQLite, PostgreSQL, or Redis.

## License

MIT
