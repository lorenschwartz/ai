# AI-Mi Frontend

The React frontend for the AI-powered restaurant waiter system.

## Setup

1. Install dependencies:

```bash
npm install
```

2. Copy environment variables:

```bash
cp .env.example .env
```

3. Update the `.env` file with your actual configuration values.

4. Start the development server:

```bash
npm run dev
```

## Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production  
- `npm run preview` - Preview production build
- `npm test` - Run unit tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:e2e` - Run end-to-end tests
- `npm run test:e2e:ui` - Run E2E tests with UI
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues
- `npm run format` - Format code with Prettier
- `npm run type-check` - Run TypeScript type checking

## Features

- 🤖 AI conversation interface
- 🎤 Voice recognition support
- 📱 Responsive design
- 💳 Stripe payment integration
- 🧪 Comprehensive testing setup

## Project Structure

```text
src/
├── components/    # React components
├── hooks/         # Custom React hooks
├── services/      # API service functions
├── store/         # State management
├── types/         # TypeScript type definitions
└── utils/         # Utility functions
```