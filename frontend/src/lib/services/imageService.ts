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
  imageData: string; // Can be either a data URL or a public URL from Supabase
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
  try {
    console.log('Starting image-to-image generation with params:', {
      prompt: params.prompt,
      imageDataIsUrl: params.imageData.startsWith('http'),
      hasNegativePrompt: !!params.negativePrompt,
      strength: params.strength
    });

    // Send the image URL or data URL directly with the generation request
    console.log('Initiating image-to-image generation');
    
    const response = await fetch(`${API_URL}/images/generate-from-image`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: params.prompt,
        imageUrl: params.imageData, // Send the image URL directly
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
      
      throw new Error(errorData.message || `Failed to generate image (${response.status}: ${response.statusText})`);
    }
    
    const result = await response.json();
    console.log('Generation result:', result);
    
    if (!result.imageUrl) {
      console.error('Invalid response format:', result);
      throw new Error('No image URL in response');
    }
    
    console.log('Image generation completed successfully');
    return result;
  } catch (error) {
    console.error('Generation error:', error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Failed to generate image from image');
  }
} 