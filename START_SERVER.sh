#!/bin/bash

echo "========================================"
echo "Starting Nepal E-Governance Server"
echo "========================================"
echo ""

# Get the directory where this script is located
cd "$(dirname "$0")"

echo "Installing dependencies (first time only)..."
npm install

echo ""
echo "Starting server..."
echo ""
echo "✅ Server will start on http://localhost:3000"
echo "✅ Keep this window open!"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

npm start

