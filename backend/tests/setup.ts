import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Mock Leonardo config
jest.mock('../src/config/leonardo', () => ({
  __esModule: true,
  default: {
    apiKey: 'test-api-key',
    apiUrl: 'https://api.leonardo.ai',
    defaultModel: 'test-model-id',
    defaultSettings: {
      width: 512,
      height: 512,
      num_images: 1,
      promptMagic: false,
      public: false,
    },
    polling: {
      maxAttempts: 3,
      delay: 1000,
    },
  },
})); 