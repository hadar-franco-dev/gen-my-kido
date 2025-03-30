export interface GenerateImageRequest {
  prompt: string;
  baseImage?: string;
  negativePrompt?: string;
}

export interface ImageFromImageRequest {
  prompt: string;
  imageUrl: string;
  negativePrompt?: string;
  strength?: number;
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

export interface UploadInitImageResponse {
  uploadInitImage: {
    id: string;
    url: string;
    fields: string;
  };
}

export interface UploadImageResult {
  id: string;
  url: string;
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