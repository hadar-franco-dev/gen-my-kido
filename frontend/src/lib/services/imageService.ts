/**
 * Service for handling image generation API calls
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

interface RetryConfig {
  maxAttempts: number;
  initialDelay: number;
  maxDelay: number;
  backoffFactor: number;
  shouldRetry?: (error: any) => boolean;
}

const defaultRetryConfig: RetryConfig = {
  maxAttempts: 3,
  initialDelay: 1000, // 1 second
  maxDelay: 10000,    // 10 seconds
  backoffFactor: 2,   // Double the delay each time
  shouldRetry: (error) => {
    // Retry on rate limits and network errors
    return error?.status === 429 || // Rate limit
           error?.status >= 500 ||  // Server errors
           error?.message?.includes('network') ||
           error?.message?.includes('timeout');
  }
};

async function withRetry<T>(
  operation: () => Promise<T>,
  config: RetryConfig = defaultRetryConfig
): Promise<T> {
  let lastError: Error | null = null;
  let delay = config.initialDelay;

  for (let attempt = 1; attempt <= config.maxAttempts; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error as Error;
      
      // Check if we should retry this error
      if (config.shouldRetry && !config.shouldRetry(error)) {
        throw error;
      }

      // If this was the last attempt, throw the error
      if (attempt === config.maxAttempts) {
        throw new Error(`Operation failed after ${attempt} attempts: ${lastError.message}`);
      }

      // Calculate next delay with exponential backoff
      delay = Math.min(delay * config.backoffFactor, config.maxDelay);
      
      // Add some jitter to prevent thundering herd
      const jitter = Math.random() * 100;
      await new Promise(resolve => setTimeout(resolve, delay + jitter));
    }
  }

  throw lastError;
}

export interface GenerateImageParams {
  prompt: string;
  negativePrompt?: string;
}

export interface GenerateImageFromImageParams {
  prompt: string;
  imageData: string; // Can be either a data URL or a public URL from Supabase
  negativePrompt?: string;
  strength?: number;
}

export interface ImageResponse {
  imageUrl: string;
  generationId: string;
}

export interface ImageError extends Error {
  code?: string;
  statusCode?: number;
}

export class ImageServiceError extends Error implements ImageError {
  code?: string;
  statusCode?: number;

  constructor(message: string, code?: string, statusCode?: number) {
    super(message);
    this.name = 'ImageServiceError';
    this.code = code;
    this.statusCode = statusCode;
  }
}

/**
 * Generate an image from a text prompt
 */
export async function generateImage(params: GenerateImageParams): Promise<ImageResponse> {
  return withRetry(async () => {
    const response = await fetch(`${API_URL}/images/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new ImageServiceError(
        errorData.message || 'Failed to generate image',
        errorData.code,
        response.status
      );
    }
    
    return await response.json();
  });
}

/**
 * Generate an image from another image and a text prompt
 */
export async function generateImageFromImage(params: GenerateImageFromImageParams): Promise<ImageResponse> {
  return withRetry(async () => {
    console.log('Starting image-to-image generation with params:', {
      prompt: params.prompt,
      imageDataIsUrl: params.imageData.startsWith('http'),
      hasNegativePrompt: !!params.negativePrompt,
      strength: params.strength
    });

    console.log('Initiating image-to-image generation');
    
    const response = await fetch(`${API_URL}/images/generate-from-image`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: params.prompt,
        imageUrl: params.imageData,
        negativePrompt: params.negativePrompt,
        strength: params.strength,
      }),
    });
    
    console.log('Got response:', {
      status: response.status,
      statusText: response.statusText,
      headers: Object.fromEntries(response.headers.entries())
    });
    
    if (!response.ok) {
      const text = await response.text();
      console.error('Error response body:', text);
      
      let errorData;
      try {
        errorData = JSON.parse(text);
      } catch (e) {
        errorData = { message: text || 'Unknown error' };
      }
      
      console.error('Generation error response:', {
        status: response.status,
        statusText: response.statusText,
        errorData
      });
      
      throw new ImageServiceError(
        errorData.message || `Failed to generate image (${response.status}: ${response.statusText})`,
        errorData.code,
        response.status
      );
    }
    
    const result = await response.json();
    console.log('Generation result:', result);
    
    if (!result.imageUrl) {
      console.error('Invalid response format:', result);
      throw new ImageServiceError('No image URL in response', undefined, response.status);
    }
    
    console.log('Image generation completed successfully');
    return result;
  });
} 