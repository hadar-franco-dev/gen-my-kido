import axios from 'axios';
import FormData from 'form-data';
import { GenerateImageRequest, GenerateImageResponse, ImageFromImageRequest, LeonardoApiError, UploadInitImageResponse, UploadImageResult } from '../types/index';
import config from '../config/leonardo';

console.log('=== Leonardo Service Initialization ===');
console.log('API URL:', config.apiUrl);
console.log('API Key format check:', config.apiKey.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i) ? 'Valid UUID format' : 'Invalid UUID format');
console.log('Default Model:', config.defaultModel);
console.log('Default Settings:', config.defaultSettings);
console.log('Polling Settings:', config.polling);
console.log('=====================================');

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
  presetStyle?: string;
  generationMode?: string;
  imageGuidance?: string;
  finetunedModel?: string;
}

interface ImageFromImagePayload extends GenerationPayload {
  init_image_id: string;
  init_strength: number;
}

// Direct image-to-image generation with base64 image data
interface DirectImageToImagePayload {
  prompt: string;
  modelId: string;
  num_images: number;
  width: number;
  height: number;
  promptMagic: boolean;
  public: boolean;
  image: string; // URL to the image
  init_strength: number;
  negative_prompt?: string;
}

export class LeonardoService {
  static async generateImage(request: GenerateImageRequest): Promise<GenerateImageResponse> {
    console.log('\n=== Starting Text-to-Image Generation ===');
    console.log('Request:', request);
    
    try {
      const payload: GenerationPayload = {
        prompt: request.prompt,
        modelId: config.defaultModel,
        ...config.defaultSettings,
        ...(request.negativePrompt && { negative_prompt: request.negativePrompt })
      };
      
      console.log('\n=== Leonardo API Request Details ===');
      console.log('Endpoint:', `${config.apiUrl}/generations`);
      console.log('Method: POST');
      console.log('Headers:', {
        'accept': 'application/json',
        'content-type': 'application/json',
        'authorization': 'Bearer [REDACTED]'
      });
      console.log('Request Body:', JSON.stringify(payload, null, 2));
      console.log('===================================\n');
      
      console.log('Sending request to Leonardo API...');
      
      const generationResponse = await leonardoApi.post('/generations', payload);
      const generationId = generationResponse.data.sdGenerationJob.generationId;
      console.log('Generation initiated with ID:', generationId);

      // Poll for the generation result
      let attempts = 0;
      while (attempts < config.polling.maxAttempts) {
        console.log(`\nPolling attempt ${attempts + 1}/${config.polling.maxAttempts}`);
        const result = await leonardoApi.get(`/generations/${generationId}`);
        const generation = result.data.generations_by_pk;
        console.log('Generation status:', generation.status);
        
        if (generation.status === 'COMPLETE') {
          console.log('Generation completed successfully!');
          console.log('Generated image URL:', generation.generated_images[0].url);
          return {
            imageUrl: generation.generated_images[0].url,
            generationId,
          };
        }

        if (generation.status === 'FAILED') {
          console.error('Generation failed:', generation.error);
          throw new Error('Image generation failed');
        }

        console.log(`Waiting ${config.polling.delay}ms before next attempt...`);
        await new Promise(resolve => setTimeout(resolve, config.polling.delay));
        attempts++;
      }

      console.error('Generation timed out after', config.polling.maxAttempts, 'attempts');
      throw new Error('Generation timeout');
    } catch (error) {
      console.error('\nError in generateImage:', error);
      if (axios.isAxiosError(error)) {
        console.error('Axios error details:', {
          status: error.response?.status,
          data: error.response?.data,
          message: error.message
        });
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

  static async uploadImage(imageUrl: string): Promise<UploadImageResult> {
    console.log('\n=== Starting Image Upload Process ===');
    console.log('Input image URL:', imageUrl);
    
    try {
      // Step 1: Get presigned URL
      console.log('Step 1: Getting presigned URL from Leonardo...');
      const initImageResponse = await leonardoApi.post<UploadInitImageResponse>('/init-image', {
        extension: 'jpg'
      });

      const { id, url, fields } = initImageResponse.data.uploadInitImage;
      const parsedFields = JSON.parse(fields);
      console.log('Received presigned URL data:', { id, url, fields: parsedFields });

      // Step 2: Download the image
      console.log('\nStep 2: Downloading image from provided URL...');
      let imageBuffer: Buffer;
      if (imageUrl.startsWith('data:')) {
        console.log('Processing data URL...');
        const base64Data = imageUrl.split(',')[1];
        imageBuffer = Buffer.from(base64Data, 'base64');
      } else {
        console.log('Downloading from URL...');
        const imageResponse = await axios.get(imageUrl, { 
          responseType: 'arraybuffer',
          maxContentLength: 5 * 1024 * 1024 // 5MB limit
        });
        imageBuffer = Buffer.from(imageResponse.data);
      }
      console.log('Image downloaded successfully, size:', imageBuffer.length, 'bytes');

      // Step 3: Upload to presigned URL
      console.log('\nStep 3: Uploading to presigned URL...');
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
      console.log('Upload to presigned URL successful');
      
      // Return the ID and original URL
      console.log('Upload process completed successfully');
      console.log('Returning:', { id, url: imageUrl });
      return {
        id,
        url: imageUrl
      };
    } catch (error) {
      console.error('\nError in uploadImage:', error);
      if (axios.isAxiosError(error)) {
        console.error('Axios error details:', {
          status: error.response?.status,
          data: error.response?.data,
          message: error.message
        });
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
    console.log('\n=== Starting Image-to-Image Generation ===');
    console.log('Request:', request);
    
    try {
      // First, upload the image to get an init_image_id
      console.log('\nStep 1: Uploading source image to Leonardo...');
      const uploadResult = await this.uploadImage(request.imageUrl);
      console.log('Image uploaded successfully:', uploadResult);
      
      // Use the init_image_id for generation
      console.log('\nStep 2: Preparing generation request...');
      const payload: ImageFromImagePayload = {
        prompt: request.prompt,
        modelId: config.defaultModel,
        width: config.defaultSettings.width,
        height: config.defaultSettings.height,
        num_images: config.defaultSettings.num_images,
        public: config.defaultSettings.public,
        promptMagic: config.defaultSettings.promptMagic,
        init_image_id: uploadResult.id,
        init_strength: request.strength || 0.5,
        ...(request.negativePrompt && { negative_prompt: request.negativePrompt })
      };
      
      console.log('Generation payload:', payload);
      console.log('Sending request to Leonardo API...');
      
      const generationResponse = await leonardoApi.post('/generations', payload);
      const generationId = generationResponse.data.sdGenerationJob.generationId;
      console.log('Generation initiated with ID:', generationId);

      // Poll for the generation result
      let attempts = 0;
      while (attempts < config.polling.maxAttempts) {
        console.log(`\nPolling attempt ${attempts + 1}/${config.polling.maxAttempts}`);
        const result = await leonardoApi.get(`/generations/${generationId}`);
        const generation = result.data.generations_by_pk;
        console.log('Generation status:', generation.status);
        
        if (generation.status === 'COMPLETE') {
          console.log('Generation completed successfully!');
          console.log('Generated image URL:', generation.generated_images[0].url);
          return {
            imageUrl: generation.generated_images[0].url,
            generationId,
          };
        }

        if (generation.status === 'FAILED') {
          console.error('Generation failed:', generation.error);
          throw new Error(`Image generation failed: ${generation.error || 'Unknown error'}`);
        }

        console.log(`Waiting ${config.polling.delay}ms before next attempt...`);
        await new Promise(resolve => setTimeout(resolve, config.polling.delay));
        attempts++;
      }

      console.error('Generation timed out after', config.polling.maxAttempts, 'attempts');
      throw new Error('Generation timeout');
    } catch (error) {
      console.error('\nError in generateImageFromImage:', error);
      if (axios.isAxiosError(error)) {
        console.error('Axios error details:', {
          status: error.response?.status,
          data: error.response?.data,
          message: error.message
        });
        const apiError: LeonardoApiError = {
          error: 'LEONARDO_API_ERROR',
          message: error.response?.data?.error || error.message || 'Failed to generate image from image',
          statusCode: error.response?.status || 500,
        };
        throw apiError;
      }
      throw error;
    }
  }
} 