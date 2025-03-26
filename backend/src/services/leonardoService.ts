import axios from 'axios';
import FormData from 'form-data';
import { GenerateImageRequest, GenerateImageResponse, ImageFromImageRequest, LeonardoApiError, UploadInitImageResponse } from '../types/index';
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

interface ImageFromImagePayload extends GenerationPayload {
  init_image_id: string;
  init_strength: number;
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

  static async uploadImage(imageUrl: string): Promise<string> {
    try {
      // Step 1: Get presigned URL
      const initImageResponse = await leonardoApi.post<UploadInitImageResponse>('/init-image', {
        extension: 'jpg'
      });

      const { id, url, fields } = initImageResponse.data.uploadInitImage;
      const parsedFields = JSON.parse(fields);

      // Step 2: Download the image from the provided URL
      const imageResponse = await axios.get(imageUrl, { responseType: 'arraybuffer' });
      const imageBuffer = Buffer.from(imageResponse.data);

      // Step 3: Upload to presigned URL
      const formData = new FormData();
      Object.entries(parsedFields).forEach(([key, value]) => {
        formData.append(key, value as string);
      });
      formData.append('file', imageBuffer, { filename: 'image.jpg' });

      await axios.post(url, formData, {
        headers: {
          ...formData.getHeaders(),
        },
      });

      return id;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const apiError: LeonardoApiError = {
          error: 'LEONARDO_API_ERROR',
          message: error.response?.data?.error || 'Failed to upload image',
          statusCode: error.response?.status || 500,
        };
        throw apiError;
      }
      throw error;
    }
  }

  static async generateImageFromImage(request: ImageFromImageRequest): Promise<GenerateImageResponse> {
    try {
      // First, upload the image to get an init_image_id
      const initImageId = await this.uploadImage(request.imageUrl);
      
      const payload: ImageFromImagePayload = {
        prompt: request.prompt,
        modelId: config.defaultModel,
        width: config.defaultSettings.width,
        height: config.defaultSettings.height,
        num_images: config.defaultSettings.num_images,
        public: config.defaultSettings.public,
        promptMagic: config.defaultSettings.promptMagic,
        init_image_id: initImageId,
        init_strength: request.strength || 0.5,
        ...(request.negativePrompt && { negative_prompt: request.negativePrompt })
      };
      
      console.log('Sending image-from-image generation request:', payload);
      const generationResponse = await leonardoApi.post('/generations', payload);
      const generationId = generationResponse.data.sdGenerationJob.generationId;

      // Poll for the generation result
      let attempts = 0;
      while (attempts < config.polling.maxAttempts) {
        console.log(`Polling for generation result... (Attempt ${attempts + 1}/${config.polling.maxAttempts})`);
        const result = await leonardoApi.get(`/generations/${generationId}`);
        const generation = result.data.generations_by_pk;
        
        if (generation.status === 'COMPLETE') {
          console.log('Generation complete:', generation.generated_images[0].url);
          return {
            imageUrl: generation.generated_images[0].url,
            generationId,
          };
        }

        if (generation.status === 'FAILED') {
          console.log('Generation failed:', generation.error);
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
          message: error.response?.data?.error || 'Failed to generate image from image',
          statusCode: error.response?.status || 500,
        };
        throw apiError;
      }
      throw error;
    }
  }
} 