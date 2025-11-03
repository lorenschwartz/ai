import '@testing-library/jest-dom';

// Mock environment variables
Object.defineProperty(window, 'env', {
  value: {
    VITE_API_BASE_URL: 'http://localhost:3001/api',
    VITE_STRIPE_PUBLISHABLE_KEY: 'pk_test_123',
    VITE_ENABLE_SPEECH_RECOGNITION: 'true',
    VITE_ENABLE_ANALYTICS: 'false',
  },
  writable: true,
});

// Mock Web Speech API
Object.defineProperty(window, 'SpeechRecognition', {
  value: jest.fn(() => ({
    start: jest.fn(),
    stop: jest.fn(),
    onresult: null,
    onerror: null,
    onend: null,
  })),
});

Object.defineProperty(window, 'webkitSpeechRecognition', {
  value: window.SpeechRecognitionEvent
});

// Mock ResizeObserver
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));