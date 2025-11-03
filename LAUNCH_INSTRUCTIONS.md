# 🚀 AI-Mi Application Launch Instructions

## Prerequisites

Make sure you have the following installed:
- **Node.js 18+** (check with `node --version`)
- **npm** (comes with Node.js)
- **Git** (for version control)

## 🎯 Quick Start (2 Terminal Windows)

### Terminal 1: Backend Server

1. **Navigate to backend directory:**
   ```bash
   cd /Users/lorenschwartz/Library/Mobile\ Documents/com~apple~CloudDocs/DeveloperSync/Projects/personal/ai-mi/backend
   ```

2. **Install dependencies (if not already done):**
   ```bash
   npm install
   ```

3. **Start the backend server:**
   ```bash
   npm run dev
   ```

   **Expected output:**
   ```
   🚀 AI-Mi backend server running on port 3001
   🏥 Health check: http://localhost:3001/health
   📡 API base URL: http://localhost:3001/api
   🌍 Environment: development
   ✅ OpenAI API key configured - AI features enabled
   ```

### Terminal 2: Frontend Application

1. **Navigate to frontend directory:**
   ```bash
   cd /Users/lorenschwartz/Library/Mobile\ Documents/com~apple~CloudDocs/DeveloperSync/Projects/personal/ai-mi/frontend
   ```

2. **Install dependencies (if not already done):**
   ```bash
   npm install
   ```

3. **Start the frontend server:**
   ```bash
   npm run dev
   ```

   **Expected output:**
   ```
   VITE v5.4.21  ready in 355 ms
   ➜  Local:   http://localhost:3000/
   ➜  Network: use --host to expose
   ```

## 🌐 Access the Application

1. **Open your browser** and navigate to: **http://localhost:3000**

2. **You should see the AI-Mi welcome screen** with:
   - System status indicators
   - Customer setup form
   - AI capabilities list

## 🧪 Testing the Application

### Step 1: Create a Customer Profile
1. Fill in your name (required)
2. Add table number (optional)
3. Set dietary preferences (vegetarian, allergies, etc.)
4. Choose spice level
5. Click "Start Chatting"

### Step 2: Chat with AI Assistant
Try these sample conversations:
- **"Show me the menu"**
- **"I'm vegetarian, what do you recommend?"**
- **"I have a nut allergy, what's safe for me?"**
- **"What's popular today?"**
- **"I'd like to place an order"**

## 📊 System Status Check

### Backend Health Check
Visit: **http://localhost:3001/health**

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2025-11-03T...",
  "environment": "development",
  "services": {
    "openai": true,
    "database": false,
    "redis": false
  }
}
```

### AI Service Test
Visit: **http://localhost:3001/api/v1/ai/health**

Expected response:
```json
{
  "success": true,
  "data": {
    "status": "healthy",
    "openai": true,
    "timestamp": "2025-11-03T..."
  }
}
```

## 🛠️ Troubleshooting

### Backend Won't Start
- **Check if port 3001 is free:** `lsof -i :3001`
- **Kill any existing processes:** `pkill -f nodemon`
- **Verify OpenAI API key** in `backend/.env`

### Frontend Won't Start
- **Check if port 3000 is free:** `lsof -i :3000`
- **Kill any existing processes:** `pkill -f vite`
- **Clear node_modules if needed:** `rm -rf node_modules && npm install`

### AI Not Responding
- **Verify OpenAI API key** is correctly set in `backend/.env`
- **Check backend logs** for OpenAI connection errors
- **Test AI health endpoint:** http://localhost:3001/api/v1/ai/health

### Browser Console Errors
- **Open browser dev tools** (F12)
- **Check Network tab** for failed API calls
- **Verify CORS configuration** in backend `.env`

## 🔄 Stopping the Application

### Stop Backend
In the backend terminal, press `Ctrl + C`

### Stop Frontend  
In the frontend terminal, press `Ctrl + C`

### Force Kill All Processes
```bash
# Kill all nodemon processes (backend)
pkill -f nodemon

# Kill all vite processes (frontend)
pkill -f vite

# Verify ports are free
lsof -i :3000,3001
```

## 🚀 Production Deployment Notes

For production deployment, you'll need to:

1. **Set up PostgreSQL database**
2. **Configure Redis for session storage**
3. **Set production environment variables**
4. **Build frontend for production:** `npm run build`
5. **Use process manager like PM2**
6. **Set up reverse proxy (nginx)**
7. **Configure SSL certificates**

## 📝 Available Scripts

### Backend Scripts
- `npm run dev` - Start development server with hot reload
- `npm run build` - Build TypeScript to JavaScript
- `npm run start` - Start production server
- `npm run test` - Run tests
- `npm run lint` - Check code quality

### Frontend Scripts  
- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run test` - Run unit tests
- `npm run type-check` - Check TypeScript types

## 🎉 Success!

If everything is working correctly, you should see:

- ✅ Backend running at http://localhost:3001
- ✅ Frontend running at http://localhost:3000
- ✅ AI service responding to queries
- ✅ Customer can create profile and chat
- ✅ System status shows all services online

**You now have a fully functional AI-powered restaurant assistant!** 🤖🍽️