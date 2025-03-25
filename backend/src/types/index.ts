export interface GenerateImageRequest {
  prompt: string;
  baseImage?: string;
  negativePrompt?: string;
}

export interface GenerateImageResponse {
  imageUrl: string;
  generationId: string;
}

export interface LeonardoApiError {
  error: string;
  message: string;
  statusCode: number;
}

export interface LeonardoConfig {
  apiKey: string;
  apiUrl: string;
  defaultModel: string;
  defaultSettings: {
    width: number;
    height: number;
    num_images: number;
    promptMagic: boolean;
    public: boolean;
  };
  polling: {
    maxAttempts: number;
    delay: number;
  };
} 