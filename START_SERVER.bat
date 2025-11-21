@echo off
echo ========================================
echo Starting Nepal E-Governance Server
echo ========================================
echo.
cd /d "%~dp0"
echo Installing dependencies (first time only)...
call npm install
echo.
echo Starting server...
echo.
echo ✅ Server will start on http://localhost:3000
echo ✅ Keep this window open!
echo.
echo Press Ctrl+C to stop the server
echo.
call npm start
pause

