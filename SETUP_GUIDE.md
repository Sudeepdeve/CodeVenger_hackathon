# 🇳🇵 Nepal e-Governance Platform - Setup & API Guide

## Quick Start

### 1. Start the Server
```bash
cd c:\xampp2\htdocs\uplodedFile
npm start
```
Server runs at: `http://localhost:3000`

### 2. Initialize Database
Open in browser or curl:
```
http://localhost:3000/backend/setup.php
```

Expected response:
```json
{
  "success": true,
  "message": "Database and tables created successfully",
  "timestamp": "2025-11-21 12:00:00"
}
```

## Architecture

```
Frontend (JavaScript)
    ↓
Node.js/Express Server (server.js)
    ↓
PHP Backend (backend/*.php)
    ↓
MySQL Database (user_management_db)
```

## Available API Endpoints

### Authentication (`/backend/auth.php`)

**Signup**
```bash
curl -X POST http://localhost:3000/backend/auth.php?action=signup \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john_doe",
    "password": "secure_password123",
    "email": "john@example.com"
  }'
```

**Login**
```bash
curl -X POST http://localhost:3000/backend/auth.php?action=login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john_doe",
    "password": "secure_password123"
  }'
```

**Get User Profile**
```bash
curl http://localhost:3000/backend/auth.php?action=get-user&user_id=1
```

**Update User Profile**
```bash
curl -X POST http://localhost:3000/backend/auth.php?action=update-profile \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": 1,
    "full_name": "John Doe",
    "gender": "Male",
    "date_of_birth": "1990-01-15",
    "blood_group": "O+",
    "mobile_number": "+977-9841234567",
    "province": "3",
    "district": "Kathmandu",
    "municipality": "Kathmandu Metropolitan City",
    "ward_no": 1,
    "tole_street": "Thamel",
    "citizenship_number": "NP-XXXXX",
    "passport_number": "XXXXXXX"
  }'
```

### Services (`/backend/services.php`)

**Get All Services**
```bash
curl http://localhost:3000/backend/services.php?action=get-services
```

**Submit Application**
```bash
curl -X POST http://localhost:3000/backend/services.php?action=submit-application \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": 1,
    "service_id": 1
  }'
```

**Get User Applications**
```bash
curl http://localhost:3000/backend/services.php?action=get-applications&user_id=1
```

**Track Application**
```bash
curl http://localhost:3000/backend/services.php?action=track-application&application_id=APP-20251121120000-1234
```

## Database Schema

### Tables
1. **user_credentials** - User login info
2. **user_info** - User profile data
3. **applications** - Service applications (auto-created)

### Test Data
After setup, create test user:
```bash
curl -X POST http://localhost:3000/backend/auth.php?action=signup \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "test123456",
    "email": "test@example.com"
  }'
```

## Features

✅ User Registration & Login  
✅ Profile Management  
✅ Service Applications  
✅ Application Tracking  
✅ Secure Password Hashing (bcrypt)  
✅ Input Sanitization  
✅ CORS Support  
✅ JSON API responses  

## File Structure

```
uplodedFile/
├── backend/
│   ├── config.php          # Database config & utilities
│   ├── auth.php            # User authentication API
│   ├── services.php        # Services API
│   ├── setup.php           # Database initialization
│   └── README.md           # Backend documentation
├── server.js               # Node.js/Express server with PHP support
├── package.json            # Dependencies (includes php-cgi)
├── home.html               # Main dashboard
├── index.html              # Landing page
├── app.js                  # Frontend logic
└── styles.css              # Styling
```

## Requirements Met

✅ MySQL Database Connection  
✅ User Authentication System  
✅ RESTful API Endpoints  
✅ Profile Management  
✅ Service Application Tracking  
✅ Security Best Practices  
✅ Error Handling  
✅ CORS Support  

## Troubleshooting

**PHP not executing?**
- Ensure php-cgi is installed: `npm list php-cgi`
- Restart server after setup

**Database connection failed?**
- Start MySQL/XAMPP
- Verify config.php credentials
- Run setup.php first

**CORS errors?**
- CORS headers are configured in config.php
- Adjust as needed for production

## Next Steps

1. ✅ Backend API running
2. 📱 Connect frontend to API endpoints
3. 🔐 Implement authentication UI
4. 🔍 Add more service types
5. 📊 Create admin dashboard

For more details, see `/backend/README.md`
