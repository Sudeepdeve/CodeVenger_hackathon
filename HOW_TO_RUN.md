# 🚀 How to Run - Step by Step Guide

## Prerequisites
Make sure you have **Node.js** installed on your computer.
- Download from: https://nodejs.org/
- Choose the LTS (Long Term Support) version
- Install it (just click Next, Next, Next)

## Step 1: Open Terminal/Command Prompt

### On Mac:
- Press `Cmd + Space`
- Type "Terminal"
- Press Enter

### On Windows:
- Press `Win + R`
- Type "cmd"
- Press Enter

### On Linux:
- Press `Ctrl + Alt + T`

## Step 2: Navigate to Your Project Folder

In the terminal, type:
```bash
cd "/Users/neeraj/Downloads/uploded file 2"
```

**Or** if you're on Windows:
```bash
cd "C:\Users\neeraj\Downloads\uploded file 2"
```

**Tip:** You can also drag the folder into the terminal window to auto-fill the path!

## Step 3: Install Dependencies

Type this command and press Enter:
```bash
npm install
```

Wait for it to finish (it will download required packages). You should see:
```
added 50 packages in 5s
```

## Step 4: Start the Backend Server

Type this command and press Enter:
```bash
npm start
```

You should see:
```
🇳🇵 Nepal E-Governance Backend Server
✅ Server running on http://localhost:3000
📡 API available at http://localhost:3000/api
📄 Data stored in: /path/to/data/notices.json
🚀 Ready to serve local, federal, and citizen portals!
```

**Keep this terminal window open!** The server needs to keep running.

## Step 5: Open the Admin Panel

1. Open your web browser (Chrome, Firefox, Safari, etc.)
2. Press `Cmd + O` (Mac) or `Ctrl + O` (Windows)
3. Navigate to your project folder
4. Open `proviencegov.html`

**OR** simply double-click `proviencegov.html` in your file explorer!

## Step 6: Open the Citizen Portal

1. Open another browser tab (or window)
2. Open `home.html` the same way

## Step 7: Test It!

1. In `proviencegov.html` (Admin Panel):
   - Fill in the notice form
   - Click "Publish Notice"

2. In `home.html` (Citizen Portal):
   - Check the "Important Notices" section
   - Your notice should appear instantly! ✨

## Troubleshooting

### ❌ "npm: command not found"
**Solution:** Node.js is not installed. Download and install from https://nodejs.org/

### ❌ "Port 3000 already in use"
**Solution:** 
1. Find what's using port 3000 and close it
2. OR change the port in `server.js` (line 12):
   ```javascript
   const PORT = 3001; // Change to 3001 or any other number
   ```
3. Then update `API_BASE_URL` in `proviencegov.html` and `app.js`:
   ```javascript
   const API_BASE_URL = 'http://localhost:3001/api';
   ```

### ❌ "Cannot GET /" or connection errors
**Solution:** 
- Make sure the server is running (Step 4)
- Check that you see the success message in terminal
- Try refreshing the browser page

### ❌ Notices not appearing
**Solution:**
- Make sure backend server is running
- Check browser console (F12) for errors
- Try opening `http://localhost:3000/api/health` in browser - should show JSON response

## Quick Commands Reference

```bash
# Install dependencies (first time only)
npm install

# Start the server
npm start

# Stop the server
Press Ctrl + C in the terminal
```

## What's Running?

- **Backend Server**: `http://localhost:3000`
- **API Endpoint**: `http://localhost:3000/api/notices`
- **Data File**: `data/notices.json` (auto-created)

## Next Steps

Once everything is running:
1. ✅ Test publishing notices
2. ✅ Test viewing notices in citizen portal
3. ✅ Test editing/deleting notices
4. ✅ Ready to add Local & Federal government panels!

---

**Need Help?** Check the browser console (F12) for any error messages!

