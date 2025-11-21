# 🚀 Quick Start Guide - Nepal E-Governance Backend

## Step 1: Install Node.js (if not installed)
Download from: https://nodejs.org/

## Step 2: Install Dependencies
Open terminal in this folder and run:
```bash
npm install
```

## Step 3: Start the Backend Server
```bash
npm start
```

You should see:
```
🇳🇵 Nepal E-Governance Backend Server
✅ Server running on http://localhost:3000
📡 API available at http://localhost:3000/api
```

## Step 4: Open the Portals

### For Government Admin:
Open `proviencegov.html` in your browser

### For Citizens:
Open `home.html` in your browser

## How It Works

1. **Backend Server** (`server.js`) - Stores all notices in `data/notices.json`
2. **Admin Panel** (`proviencegov.html`) - Publish/manage notices
3. **Citizen Portal** (`home.html`) - View notices published by government

## Test It!

1. Start the server: `npm start`
2. Open `proviencegov.html`
3. Publish a notice
4. Open `home.html` in another tab
5. See your notice appear instantly! ✨

## All 3 Parts See Same Data

✅ **Local Government** - Can publish notices
✅ **Federal Government** - Can publish notices (same backend)
✅ **Citizens** - See all notices instantly

When ANY government publishes a notice, ALL parts see it immediately!

## Troubleshooting

**Port 3000 already in use?**
- Change PORT in `server.js` to another number (e.g., 3001)
- Update `API_BASE_URL` in `proviencegov.html` and `app.js` to match

**Backend not connecting?**
- Make sure server is running: `npm start`
- Check browser console for errors
- Verify `http://localhost:3000/api/health` works

## Next Steps

After this works, we can add:
- Separate Local Government panel
- Separate Federal Government panel
- User authentication
- Real-time updates with WebSockets

