interface LeonardoConfig {
  apiKey: string;
  apiUrl: string;
  defaultModel: string;
  defaultSettings: {
    num_images: number;
    width: number;
    height: number;
    promptMagic: boolean;
    public: boolean;
  };
  polling: {
    maxAttempts: number;
    delay: number;
  };
}

if (!process.env.LEONARDO_API_KEY) {
  throw new Error('LEONARDO_API_KEY environment variable is not set');
}

const config: LeonardoConfig = {
  apiKey: process.env.LEONARDO_API_KEY,
  apiUrl: 'https://cloud.leonardo.ai/api/rest/v1',
  defaultModel: 'ac614f96-1082-45bf-be9d-757f2d31c174', // Leonardo Creative
  defaultSettings: {
    num_images: 1,
    width: 1024,
    height: 1024,
    promptMagic: false,
    public: false,
  },
  polling: {
    maxAttempts: 30,
    delay: 2000, // 2 seconds
  },
};

// Validate configuration
if (!config.apiKey || !config.apiUrl) {
  throw new Error('Leonardo API configuration is missing');
}

if (!config.apiKey.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)) {
  throw new Error('Invalid Leonardo API key format');
}

export default config; 