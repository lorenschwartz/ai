#!/bin/bash

# AI-Mi Codespace Startup Script
echo "🚀 Starting AI-Mi Restaurant Assistant Demo..."

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check Node.js version
echo "📋 Checking Node.js version..."
node_version=$(node -v)
echo "✅ Node.js version: $node_version"

# Install dependencies if not already installed
echo "📦 Installing dependencies..."

if [ ! -d "backend/node_modules" ]; then
    echo "Installing backend dependencies..."
    cd backend && npm install
    cd ..
fi

if [ ! -d "frontend/node_modules" ]; then
    echo "Installing frontend dependencies..."
    cd frontend && npm install
    cd ..
fi

# Start the applications in background
echo "🚀 Starting AI-Mi services..."

# Start backend
echo "Starting backend server..."
cd backend
npm run dev &
BACKEND_PID=$!
cd ..

# Wait a moment for backend to start
sleep 3

# Start frontend
echo "Starting frontend server..."
cd frontend
npm run dev &
FRONTEND_PID=$!
cd ..

echo ""
echo "🎉 AI-Mi Demo is starting up!"
echo ""
echo "📍 Your services:"
echo "   📱 Frontend: http://localhost:3000"
echo "   🔧 Backend API: http://localhost:3001"
echo "   🏥 Health Check: http://localhost:3001/health"
echo ""
echo "🚀 In Codespaces:"
echo "   1. Click the 'Ports' tab"
echo "   2. Click the globe icon next to port 3000"
echo "   3. Start chatting with your AI waiter!"
echo ""
echo "🛑 To stop: Press Ctrl+C"

# Wait for user interrupt
wait $BACKEND_PID $FRONTEND_PID