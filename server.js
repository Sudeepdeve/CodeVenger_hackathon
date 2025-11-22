// ============================================
// NEPAL E-GOVERNANCE BACKEND SERVER
// Fast JSON-based backend for coordination
// ============================================

const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const PORT = 3000;
const DATA_FILE = path.join(__dirname, 'data', 'notices.json');

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname)); // Serve static files

// Ensure data directory exists
async function ensureDataDir() {
    const dataDir = path.join(__dirname, 'data');
    try {
        await fs.mkdir(dataDir, { recursive: true });
    } catch (error) {
        console.error('Error creating data directory:', error);
    }
}

// Read notices from file
async function readNotices() {
    try {
        await ensureDataDir();
        const data = await fs.readFile(DATA_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        // If file doesn't exist, return empty array
        if (error.code === 'ENOENT') {
            return [];
        }
        console.error('Error reading notices:', error);
        return [];
    }
}

// Write notices to file
async function writeNotices(notices) {
    try {
        await ensureDataDir();
        await fs.writeFile(DATA_FILE, JSON.stringify(notices, null, 2), 'utf8');
        return true;
    } catch (error) {
        console.error('Error writing notices:', error);
        return false;
    }
}

// ==================== API ROUTES ====================

// GET all notices
app.get('/api/notices', async (req, res) => {
    try {
        const notices = await readNotices();
        // Sort by date (newest first)
        const sorted = notices.sort((a, b) => 
            new Date(b.date || b.createdAt || 0) - new Date(a.date || a.createdAt || 0)
        );
        res.json({ success: true, data: sorted });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// GET single notice by ID
app.get('/api/notices/:id', async (req, res) => {
    try {
        const notices = await readNotices();
        const notice = notices.find(n => n.id === parseInt(req.params.id));
        if (!notice) {
            return res.status(404).json({ success: false, error: 'Notice not found' });
        }
        res.json({ success: true, data: notice });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// POST create new notice
app.post('/api/notices', async (req, res) => {
    try {
        const { title, desc, description, priority, icon, link, publishedBy } = req.body;
        
        if (!title || !desc) {
            return res.status(400).json({ 
                success: false, 
                error: 'Title and description are required' 
            });
        }

        const notices = await readNotices();
        const newNotice = {
            id: Date.now(),
            title,
            desc: desc || description,
            description: desc || description,
            priority: priority || 'medium',
            icon: icon || 'fa-bullhorn',
            link: link || null,
            date: new Date().toISOString().split('T')[0],
            createdAt: new Date().toISOString(),
            publishedBy: publishedBy || 'Government Admin'
        };

        notices.unshift(newNotice);
        await writeNotices(notices);

        res.json({ success: true, data: newNotice, message: 'Notice published successfully' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// PUT update notice
app.put('/api/notices/:id', async (req, res) => {
    try {
        const notices = await readNotices();
        const index = notices.findIndex(n => n.id === parseInt(req.params.id));
        
        if (index === -1) {
            return res.status(404).json({ success: false, error: 'Notice not found' });
        }

        const { title, desc, description, priority, icon, link } = req.body;
        notices[index] = {
            ...notices[index],
            title: title || notices[index].title,
            desc: desc || description || notices[index].desc,
            description: desc || description || notices[index].description,
            priority: priority || notices[index].priority,
            icon: icon || notices[index].icon,
            link: link !== undefined ? link : notices[index].link,
            updatedAt: new Date().toISOString()
        };

        await writeNotices(notices);
        res.json({ success: true, data: notices[index], message: 'Notice updated successfully' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// DELETE notice
app.delete('/api/notices/:id', async (req, res) => {
    try {
        const notices = await readNotices();
        const filtered = notices.filter(n => n.id !== parseInt(req.params.id));
        
        if (filtered.length === notices.length) {
            return res.status(404).json({ success: false, error: 'Notice not found' });
        }

        await writeNotices(filtered);
        res.json({ success: true, message: 'Notice deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// GET statistics
app.get('/api/stats', async (req, res) => {
    try {
        const notices = await readNotices();
        const stats = {
            total: notices.length,
            active: notices.length,
            highPriority: notices.filter(n => n.priority === 'high').length,
            mediumPriority: notices.filter(n => n.priority === 'medium').length,
            lowPriority: notices.filter(n => n.priority === 'low').length,
            lastUpdated: notices.length > 0 ? notices[0].createdAt : null
        };
        res.json({ success: true, data: stats });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Health check
app.get('/api/health', (req, res) => {
    res.json({ 
        success: true, 
        message: 'Nepal E-Governance Backend is running',
        timestamp: new Date().toISOString()
    });
});

// ==================== SERVER START ====================
app.listen(PORT, () => {
    console.log('🇳🇵 Nepal E-Governance Backend Server');
    console.log(`✅ Server running on http://localhost:${PORT}`);
    console.log(`📡 API available at http://localhost:${PORT}/api`);
    console.log(`📄 Data stored in: ${DATA_FILE}`);
    console.log('🚀 Ready to serve local, federal, and citizen portals!');
});

