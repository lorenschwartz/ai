# AI-Mi Codespaces Setup

Welcome to the AI-Mi Restaurant Assistant demo environment!

## 🚀 Quick Start in Codespaces

This Codespace is pre-configured to run your AI-powered restaurant assistant. Here's what happens automatically:

### ✅ Auto-Setup Complete
- Node.js 18+ installed
- Dependencies installed for both frontend and backend
- VS Code extensions loaded
- Ports 3000 (frontend) and 3001 (backend) forwarded

### 🎯 Launch the Application

**Option 1: Automatic Startup (Recommended)**
The servers should start automatically when the Codespace loads. Look for:
- Backend running on port 3001
- Frontend running on port 3000

**Option 2: Manual Startup**
If you need to start manually:

```bash
# Terminal 1: Backend
cd backend
npm run dev

# Terminal 2: Frontend  
cd frontend
npm run dev
```

### 🌐 Access Your Demo

1. **Click the "Ports" tab** in VS Code
2. **Click the globe icon** next to port 3000 to open the frontend
3. **Your AI-Mi demo is live!** 🎉

### 🧪 Demo Script

1. **Fill out customer profile:**
   - Name: "Demo User"
   - Table: "5"
   - Dietary: Select preferences
   - Click "Start Chatting"

2. **Try these conversations:**
   - "Show me the menu"
   - "I'm vegetarian, what do you recommend?"
   - "I have a nut allergy"
   - "What's popular today?"

### 🔧 Troubleshooting

**If servers aren't running:**
```bash
# Check what's running
ps aux | grep node

# Start backend manually
cd backend && npm run dev

# Start frontend manually (new terminal)
cd frontend && npm run dev
```

**If AI isn't responding:**
- The demo uses a configured OpenAI API key
- Check backend terminal for any errors
- Verify the backend health at the forwarded port 3001

### ✨ What You're Seeing

This is a complete AI-powered restaurant assistant with:
- **Natural language AI chat** using GPT-4
- **Customer preference management**
- **Dietary restriction handling**
- **Real-time conversation interface**
- **Professional restaurant UI**

**Enjoy exploring the AI-Mi experience!** 🤖🍽️