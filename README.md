# AI-Mi - AI-Powered Restaurant Waiter System

An intelligent conversational ordering system that provides personalized dining experiences through AI-powered interactions.

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- PostgreSQL
- Redis

### Development Setup

1. **Clone and navigate to the project:**

   ```bash
   git clone <repository-url>
   cd ai-mi
   ```

2. **Backend Setup:**

   ```bash
   cd backend
   npm install
   cp .env.example .env
   # Update .env with your configuration
   npm run dev
   ```

3. **Frontend Setup:**

   ```bash
   cd frontend
   npm install
   cp .env.example .env
   # Update .env with your configuration
   npm run dev
   ```

4. **Access the application:**

   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001
   - Health Check: http://localhost:3001/health

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
- ✅ Basic backend API server
- ✅ Frontend React application
- 🔨 API development in progress
- 🔨 Database models and schemas
- 🔨 AI conversation engine
- 🔨 Payment integration

## 🤝 Contributing

1. Follow the established project structure
2. Use the TDD workflow as defined in the constitution
3. Ensure all tests pass before submitting changes
4. Follow the component-first architecture principles
