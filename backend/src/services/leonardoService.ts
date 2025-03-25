import axios from 'axios';
import { GenerateImageRequest, GenerateImageResponse, LeonardoApiError } from '../types';
import config from '../config/leonardo';

console.log('API URL:', config.apiUrl);
console.log('API Key format check:', config.apiKey.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i) ? 'Valid UUID format' : 'Invalid UUID format');

const leonardoApi = axios.create({
  baseURL: config.apiUrl,
  headers: {
    'authorization': `Bearer ${config.apiKey}`,
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
});

interface GenerationPayload {
  prompt: string;
  modelId: string;
  num_images: number;
  width: number;
  height: number;
  promptMagic: boolean;
  public: boolean;
  negative_prompt?: string;
}

export class LeonardoService {
  static async generateImage(request: GenerateImageRequest): Promise<GenerateImageResponse> {
    try {
      const payload: GenerationPayload = {
        prompt: request.prompt,
        modelId: config.defaultModel,
        ...config.defaultSettings,
        ...(request.negativePrompt && { negative_prompt: request.negativePrompt })
      };
      
      console.log('Sending generation request:', payload);
      const generationResponse = await leonardoApi.post('/generations', payload);
      const generationId = generationResponse.data.sdGenerationJob.generationId;

      // Poll for the generation result
      let attempts = 0;
      while (attempts < config.polling.maxAttempts) {
        console.log(`Polling for generation result... (Attempt ${attempts + 1}/${config.polling.maxAttempts})`);
        const result = await leonardoApi.get(`/generations/${generationId}`);
        const generation = result.data.generations_by_pk;
        
        if (generation.status === 'COMPLETE') {
          return {
            imageUrl: generation.generated_images[0].url,
            generationId,
          };
        }

        if (generation.status === 'FAILED') {
          throw new Error('Image generation failed');
        }

        await new Promise(resolve => setTimeout(resolve, config.polling.delay));
        attempts++;
      }

      throw new Error('Generation timeout');
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const apiError: LeonardoApiError = {
          error: 'LEONARDO_API_ERROR',
          message: error.response?.data?.error || 'Failed to generate image',
          statusCode: error.response?.status || 500,
        };
        throw apiError;
      }
      throw error;
    }
  }
} 