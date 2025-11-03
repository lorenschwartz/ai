# AI-Mi Backend

The backend API server for the AI-powered restaurant waiter system.

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
- `npm start` - Start production server
- `npm test` - Run tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Run tests with coverage
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues
- `npm run format` - Format code with Prettier

## API Documentation

The API follows REST conventions with OpenAPI 3.0 specification. See `/docs` endpoint when server is running.

## Project Structure

```
src/
├── api/           # API routes and controllers
├── models/        # Data models and types
├── services/      # Business logic services
├── config/        # Configuration files
└── utils/         # Utility functions
```