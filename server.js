const express = require('express');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const bcryptjs = require('bcryptjs');
const app = express();
const PORT = 3000;

// Initialize SQLite database
const dbPath = path.join(__dirname, 'data', 'app.db');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Database connection error:', err);
    } else {
        console.log('✅ Connected to SQLite database');
        initializeDatabase();
    }
});

// Initialize database tables
function initializeDatabase() {
    db.serialize(() => {
        // Create users table
        db.run(`
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT UNIQUE NOT NULL,
                email TEXT UNIQUE NOT NULL,
                password TEXT NOT NULL,
                full_name TEXT,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Create user_profiles table
        db.run(`
            CREATE TABLE IF NOT EXISTS user_profiles (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER UNIQUE NOT NULL,
                gender TEXT,
                date_of_birth TEXT,
                blood_group TEXT,
                mobile_number TEXT,
                province TEXT,
                district TEXT,
                municipality TEXT,
                ward_no INTEGER,
                citizenship_number TEXT,
                passport_number TEXT,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY(user_id) REFERENCES users(id)
            )
        `);

        // Create applications table
        db.run(`
            CREATE TABLE IF NOT EXISTS applications (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                service_id INTEGER NOT NULL,
                application_id TEXT UNIQUE NOT NULL,
                status TEXT DEFAULT 'pending',
                submission_date DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY(user_id) REFERENCES users(id)
            )
        `);
    });
}

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname)));

// CORS headers
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if (req.method === 'OPTIONS') {
        res.sendStatus(200);
    } else {
        next();
    }
});

// ==================== API Routes ====================

// Signup endpoint
app.post('/api/auth/signup', (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    if (password.length < 8) {
        return res.status(400).json({ success: false, message: 'Password must be at least 8 characters' });
    }

    // Hash password
    bcryptjs.hash(password, 10, (err, hashedPassword) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Error processing password' });
        }

        // Insert user
        db.run(
            'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
            [username, email, hashedPassword],
            function(err) {
                if (err) {
                    if (err.message.includes('UNIQUE constraint failed')) {
                        return res.status(409).json({ success: false, message: 'Username or email already exists' });
                    }
                    return res.status(500).json({ success: false, message: 'Error creating account: ' + err.message });
                }

                res.status(201).json({
                    success: true,
                    message: 'Account created successfully',
                    data: {
                        user_id: this.lastID,
                        username: username,
                        email: email
                    }
                });
            }
        );
    });
});

// Login endpoint
app.post('/api/auth/login', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ success: false, message: 'Username and password required' });
    }

    db.get('SELECT * FROM users WHERE username = ?', [username], (err, user) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Database error' });
        }

        if (!user) {
            return res.status(401).json({ success: false, message: 'Invalid username or password' });
        }

        bcryptjs.compare(password, user.password, (err, isPasswordValid) => {
            if (err) {
                return res.status(500).json({ success: false, message: 'Error validating password' });
            }

            if (!isPasswordValid) {
                return res.status(401).json({ success: false, message: 'Invalid username or password' });
            }

            res.json({
                success: true,
                message: 'Login successful',
                data: {
                    user_id: user.id,
                    username: user.username,
                    email: user.email
                }
            });
        });
    });
});

// Get user profile
app.get('/api/auth/profile/:user_id', (req, res) => {
    const userId = req.params.user_id;

    db.get('SELECT * FROM user_profiles WHERE user_id = ?', [userId], (err, profile) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Database error' });
        }

        if (!profile) {
            return res.status(404).json({ success: false, message: 'Profile not found' });
        }

        res.json({ success: true, data: profile });
    });
});

// Update user profile
app.post('/api/auth/update-profile', (req, res) => {
    const { user_id, full_name, gender, date_of_birth, blood_group, mobile_number, province, district, municipality, ward_no, citizenship_number, passport_number } = req.body;

    if (!user_id) {
        return res.status(400).json({ success: false, message: 'user_id required' });
    }

    db.run(
        `INSERT OR REPLACE INTO user_profiles 
        (user_id, full_name, gender, date_of_birth, blood_group, mobile_number, province, district, municipality, ward_no, citizenship_number, passport_number, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))`,
        [user_id, full_name, gender, date_of_birth, blood_group, mobile_number, province, district, municipality, ward_no, citizenship_number, passport_number],
        (err) => {
            if (err) {
                return res.status(500).json({ success: false, message: 'Error updating profile: ' + err.message });
            }

            res.json({ success: true, message: 'Profile updated successfully', data: { user_id } });
        }
    );
});

// Get all services
app.get('/api/services', (req, res) => {
    const services = [
        { id: 1, name: 'Citizenship', category: 'Identity', fee: 500 },
        { id: 2, name: 'Passport', category: 'Identity', fee: 1000 },
        { id: 3, name: 'Driving License', category: 'Transport', fee: 800 },
        { id: 4, name: 'Business Registration', category: 'Business', fee: 2000 },
        { id: 5, name: 'Tax Registration', category: 'Finance', fee: 1500 }
    ];

    res.json({ success: true, data: services });
});

// Submit application
app.post('/api/services/apply', (req, res) => {
    const { user_id, service_id } = req.body;

    if (!user_id || !service_id) {
        return res.status(400).json({ success: false, message: 'user_id and service_id required' });
    }

    const applicationId = 'APP-' + Date.now() + '-' + Math.floor(Math.random() * 10000);

    db.run(
        'INSERT INTO applications (user_id, service_id, application_id) VALUES (?, ?, ?)',
        [user_id, service_id, applicationId],
        (err) => {
            if (err) {
                return res.status(500).json({ success: false, message: 'Error submitting application' });
            }

            res.status(201).json({
                success: true,
                message: 'Application submitted successfully',
                data: { application_id: applicationId, status: 'pending' }
            });
        }
    );
});

// Get user applications
app.get('/api/services/applications/:user_id', (req, res) => {
    const userId = req.params.user_id;

    db.all('SELECT * FROM applications WHERE user_id = ? ORDER BY submission_date DESC', [userId], (err, applications) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Database error' });
        }

        res.json({ success: true, data: applications || [] });
    });
});

// Analytics endpoint
app.get('/api/analytics/chart', (req, res) => {
    res.json({
        status: 'success',
        data: {
            categories: ['Service 1', 'Service 2', 'Service 3'],
            completed: [120, 100, 80],
            remaining: [160, 140, 120]
        }
    });
});

// ==================== Static Pages ====================

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'home.html'));
});

app.get('/home', (req, res) => {
    res.sendFile(path.join(__dirname, 'home.html'));
});

app.get('/index', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Start server
app.listen(PORT, () => {
    console.log(`\n🚀 Server running at http://localhost:${PORT}`);
    console.log(`✅ SQLite database ready`);
    console.log(`📱 API endpoints available at http://localhost:${PORT}/api/`);
    console.log(`Press Ctrl+C to stop\n`);
});
