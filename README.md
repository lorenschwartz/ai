# AI-Mi - AI-Powered Restaurant Waiter System

An intelligent conversational ordering system that provides personalized dining experiences through AI-powered interactions.

## 🚀 Quick Start

### Prerequisites

- **Node.js 18+** (check with `node --version`)
- **npm** (comes with Node.js)
- **OpenAI API Key** (already configured)

### Launch Instructions

#### **Step 1: Start the Backend Server**

Open a terminal and run:

```bash
cd backend
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

#### **Step 2: Start the Frontend Application**

Open a **new terminal window** and run:

```bash
cd frontend
npm run dev
```

**Expected output:**
```
VITE v5.4.21  ready in 355 ms
➜  Local:   http://localhost:3000/
➜  Network: use --host to expose
```

#### **Step 3: Access Your Application**

Open your web browser and go to: **http://localhost:3000**

### 🧪 Test Your AI Assistant

1. **Set up your customer profile:**
   - Enter your name
   - Add table number (optional)
   - Select dietary preferences and allergies
   - Choose spice level
   - Click "Start Chatting"

2. **Try these AI conversations:**
   - "Show me the menu"
   - "I'm vegetarian, what do you recommend?"
   - "I have a nut allergy, what's safe?"
   - "What's popular today?"
   - "I'd like to place an order"

### 🔧 Troubleshooting

**Backend won't start:**
```bash
# Kill any existing processes
pkill -f nodemon
# Try again
npm run dev
```

**Frontend won't start:**
```bash
# Kill any existing processes  
pkill -f vite
# Try again
npm run dev
```

**AI not responding:**
- Check that the OpenAI API key is in `backend/.env`
- Look for errors in the backend terminal

### 🛑 To Stop Everything

Press `Ctrl + C` in both terminal windows to stop the servers.

### ✅ Success Indicators

When everything is working correctly, you should see:
- ✅ Backend: Online (in the right sidebar)
- ✅ API: Online 
- ✅ AI Service: Online
- ✅ Chat interface responds to your messages
- ✅ AI provides restaurant recommendations

## 🏗️ Project Structure

```
ai-mi/
├── backend/                # Node.js/TypeScript backend
│   ├── src/
│   │   ├── api/           # API routes and controllers
│   │   ├── models/        # Data models
│   │   ├── services/      # Business logic
│   │   └── utils/         # Utilities
│   └── tests/             # Backend tests
├── frontend/              # React/TypeScript frontend
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── hooks/         # Custom hooks
│   │   ├── services/      # API services
│   │   └── store/         # State management
│   └── tests/             # Frontend tests
└── specs/                 # Feature specifications
```

## 🤖 Features

- **AI Conversation Interface**: Natural language ordering through GPT-powered chat
- **Voice Recognition**: Speech-to-text ordering capabilities
- **Payment Integration**: Secure payment processing with Stripe
- **Responsive Design**: Mobile-first responsive web interface
- **Real-time Updates**: Live order status and conversation state

## 🛠️ Technology Stack

- **Backend**: Node.js, TypeScript, Express.js, PostgreSQL, Redis
- **Frontend**: React, TypeScript, Vite, Tailwind CSS
- **AI**: OpenAI GPT API
- **Payments**: Stripe
- **Testing**: Jest, Playwright, React Testing Library

## 📚 Documentation

- [Feature Specifications](./specs/)
- [API Documentation](./backend/README.md)
- [Frontend Guide](./frontend/README.md)

## 🧪 Testing

- **Backend**: `cd backend && npm test`
- **Frontend**: `cd frontend && npm test`
- **E2E Tests**: `cd frontend && npm run test:e2e`

## 📝 Development Status

- ✅ Project structure and configuration
- ✅ Complete backend API server with 20+ endpoints
- ✅ Full-featured React frontend application
- ✅ Complete API integration with React Query
- ✅ AI conversation engine with OpenAI GPT-4
- ✅ Customer management and preferences
- ✅ Menu system with search and filtering
- ✅ Real-time chat interface
- ✅ Responsive mobile-friendly design
- ✅ TypeScript throughout with full type safety
- 🔨 Payment integration (planned for future release)
- 🔨 Database integration (optional - uses in-memory storage)

## 🤝 Contributing

1. Follow the established project structure
2. Use the TDD workflow as defined in the constitution
3. Ensure all tests pass before submitting changes
4. Follow the component-first architecture principles
