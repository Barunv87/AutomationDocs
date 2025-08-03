#!/bin/bash

echo "🚀 Starting Online Tutorial Application..."
echo "========================================"

# Install dependencies if not already installed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm run install-all
fi

echo "🔄 Starting servers..."
npm run dev &

# Wait for servers to start
sleep 8

echo ""
echo "✅ Online Tutorial Application is running!"
echo "========================================"
echo ""
echo "🌐 Access URLs:"
echo "   Frontend (React): http://localhost:3000"
echo "   Backend API:      http://localhost:5000"
echo ""
echo "📱 If accessing from outside this container:"
echo "   - Replace 'localhost' with your external IP or domain"
echo "   - Ensure ports 3000 and 5000 are accessible"
echo ""
echo "🎯 Application Features:"
echo "   ✨ Browse tutorials on the home page"
echo "   👤 Register/Login to access learning features"
echo "   📚 Enroll in tutorials and track progress"
echo "   📊 View your learning dashboard"
echo ""
echo "🔧 Technical Status:"
curl -s http://localhost:5000 2>/dev/null | grep -o '"status":"[^"]*"' | cut -d'"' -f4 || echo "   Backend: Starting..."
echo ""
echo "🛑 Press Ctrl+C to stop the application"
echo "========================================"

# Keep script running
wait