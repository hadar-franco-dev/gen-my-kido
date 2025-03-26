/**
 * Service for handling image generation API calls
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export interface GenerateImageParams {
  prompt: string;
  negativePrompt?: string;
}

export interface GenerateImageFromImageParams {
  prompt: string;
  imageUrl: string;
  negativePrompt?: string;
  strength?: number;
}

export interface ImageResponse {
  imageUrl: string;
  generationId: string;
}

/**
 * Generate an image from a text prompt
 */
export async function generateImage(params: GenerateImageParams): Promise<ImageResponse> {
  const response = await fetch(`${API_URL}/images/generate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params),
  });
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to generate image');
  }
  
  return await response.json();
}

/**
 * Generate an image from another image and a text prompt
 */
export async function generateImageFromImage(params: GenerateImageFromImageParams): Promise<ImageResponse> {
  const response = await fetch(`${API_URL}/images/generate-from-image`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params),
  });
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to generate image from image');
  }
  
  return await response.json();
}

/**
 * Convert a File object to a data URL
 */
export async function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
} 