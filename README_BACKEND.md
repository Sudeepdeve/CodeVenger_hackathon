# Nepal E-Governance Backend Setup

## Quick Start Guide

### 1. Install Dependencies

```bash
npm install
```

### 2. Start the Server

```bash
npm start
```

Or for development with auto-reload:

```bash
npm run dev
```

### 3. Access the Backend

- **Server**: http://localhost:3000
- **API Health Check**: http://localhost:3000/api/health
- **All Notices**: http://localhost:3000/api/notices

## API Endpoints

### GET /api/notices
Get all published notices

### GET /api/notices/:id
Get a specific notice by ID

### POST /api/notices
Create a new notice
```json
{
  "title": "Notice Title",
  "desc": "Notice Description",
  "priority": "high|medium|low",
  "icon": "fa-bullhorn",
  "link": "https://example.com",
  "publishedBy": "Province Government"
}
```

### PUT /api/notices/:id
Update an existing notice

### DELETE /api/notices/:id
Delete a notice

### GET /api/stats
Get statistics about notices

## Data Storage

All notices are stored in `data/notices.json` file. This file is automatically created when the server starts.

## Features

✅ Real-time data sharing between:
- Local Government
- Federal Government  
- Citizen Portal

✅ All three parts see the same data instantly
✅ Simple JSON-based storage (easy to backup)
✅ CORS enabled for cross-origin requests
✅ RESTful API design

## Troubleshooting

If port 3000 is already in use, you can change it in `server.js`:

```javascript
const PORT = 3000; // Change to any available port
```

## Next Steps

1. Start the backend server
2. Open `proviencegov.html` - it will automatically connect to the backend
3. Open `home.html` - it will fetch notices from the backend
4. Publish notices from the admin panel and see them appear everywhere!

