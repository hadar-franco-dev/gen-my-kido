/// <reference types="jest" />

import axios from 'axios';
import type { AxiosInstance, AxiosError } from 'axios';
import { LeonardoService } from '../src/services/leonardoService';
import { GenerateImageRequest, ImageFromImageRequest } from '../src/types/index';

// Create mock instance inside the mock factory
jest.mock('axios', () => {
  const mockAxiosInstance = {
    post: jest.fn(),
    get: jest.fn(),
  } as jest.Mocked<Pick<AxiosInstance, 'post' | 'get'>>;

  return {
    create: jest.fn(() => mockAxiosInstance),
    isAxiosError: jest.fn((error: any): error is AxiosError => error?.isAxiosError === true),
    get: jest.fn(),
    post: jest.fn(),
    __mockAxiosInstance: mockAxiosInstance // Export for test access
  };
});

const mockedAxios = axios as jest.Mocked<typeof axios>;
const mockAxiosInstance = (axios as any).__mockAxiosInstance;

describe('LeonardoService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('generateImage', () => {
    const mockRequest: GenerateImageRequest = {
      prompt: 'test prompt',
      negativePrompt: 'test negative'
    };

    it('should successfully generate an image', async () => {
      const generationId = 'test-generation-id';
      const imageUrl = 'https://example.com/image.jpg';

      mockAxiosInstance.post.mockResolvedValueOnce({
        data: {
          sdGenerationJob: { generationId }
        }
      });

      mockAxiosInstance.get.mockResolvedValueOnce({
        data: {
          generations_by_pk: {
            status: 'COMPLETE',
            generated_images: [{ url: imageUrl }]
          }
        }
      });

      const result = await LeonardoService.generateImage(mockRequest);
      expect(result).toEqual({ imageUrl, generationId });
      expect(mockAxiosInstance.post).toHaveBeenCalledWith('/generations', expect.any(Object));
      expect(mockAxiosInstance.get).toHaveBeenCalledWith(`/generations/${generationId}`);
    });

    it('should handle generation failure', async () => {
      const generationId = 'test-generation-id';

      mockAxiosInstance.post.mockResolvedValueOnce({
        data: {
          sdGenerationJob: { generationId }
        }
      });

      mockAxiosInstance.get.mockResolvedValueOnce({
        data: {
          generations_by_pk: {
            status: 'FAILED'
          }
        }
      });

      await expect(LeonardoService.generateImage(mockRequest))
        .rejects
        .toThrow('Image generation failed');
    });

    it('should handle API errors', async () => {
      const axiosError = new Error('API Error') as AxiosError;
      axiosError.isAxiosError = true;
      axiosError.response = {
        data: { error: 'API Error' },
        status: 400,
        statusText: 'Bad Request',
        headers: {},
        config: {} as any
      };
      mockAxiosInstance.post.mockRejectedValueOnce(axiosError);

      await expect(LeonardoService.generateImage(mockRequest))
        .rejects
        .toEqual({
          error: 'LEONARDO_API_ERROR',
          message: 'API Error',
          statusCode: 400
        });
    });
  });

  describe('uploadImage', () => {
    const mockImageUrl = 'https://example.com/test-image.jpg';
    const mockInitImageId = 'test-init-image-id';
    const mockPresignedUrl = 'https://example.com/presigned-url';
    const mockOutputUrl = 'data:image/jpeg;base64,ZmFrZS1pbWFnZS1kYXRh';
    const mockFields = { field1: 'value1', field2: 'value2' };

    it('should successfully upload an image', async () => {
      // Mock the presigned URL response
      mockedAxios.create.mockReturnValue({
        post: jest.fn().mockResolvedValue({
          data: {
            uploadInitImage: {
              id: mockInitImageId,
              url: mockPresignedUrl,
              fields: JSON.stringify(mockFields)
            }
          }
        })
      } as any);

      // Mock the image download
      mockedAxios.get.mockResolvedValue({
        data: Buffer.from('fake-image-data')
      });

      // Mock the upload to presigned URL
      mockedAxios.post.mockResolvedValue({
        status: 204
      });

      const result = await LeonardoService.uploadImage(mockImageUrl);
      expect(result).toEqual({
        id: mockInitImageId,
        url: expect.stringContaining('data:image/jpeg;base64,')
      });
    });

    it('should handle upload failure', async () => {
      // Mock the presigned URL response
      mockedAxios.create.mockReturnValue({
        post: jest.fn().mockRejectedValue(new Error('Upload failed'))
      } as any);

      await expect(LeonardoService.uploadImage(mockImageUrl))
        .rejects
        .toThrow('Upload failed');
    });
  });

  describe('generateImageFromImage', () => {
    const mockRequest: ImageFromImageRequest = {
      prompt: 'test prompt',
      imageUrl: 'https://example.com/test-image.jpg',
      negativePrompt: 'test negative',
      strength: 0.7
    };

    const mockInitImageId = 'test-init-image-id';
    const mockGenerationId = 'test-generation-id';
    const mockImageUrl = 'https://example.com/generated-image.jpg';
    const mockUploadResult = { 
      id: mockInitImageId, 
      url: 'https://example.com/uploaded-image.jpg' 
    };

    it('should successfully generate an image from image', async () => {
      // Mock the upload image response
      jest.spyOn(LeonardoService, 'uploadImage').mockResolvedValue(mockUploadResult);

      // Mock the generation response
      mockedAxios.create.mockReturnValue({
        post: jest.fn().mockResolvedValue({
          data: {
            sdGenerationJob: { generationId: mockGenerationId }
          }
        }),
        get: jest.fn().mockResolvedValue({
          data: {
            generations_by_pk: {
              status: 'COMPLETE',
              generated_images: [{ url: mockImageUrl }]
            }
          }
        })
      } as any);

      const result = await LeonardoService.generateImageFromImage(mockRequest);
      expect(result).toEqual({
        imageUrl: mockImageUrl,
        generationId: mockGenerationId
      });
    });

    it('should handle generation failure', async () => {
      // Mock the upload image response
      jest.spyOn(LeonardoService, 'uploadImage').mockResolvedValue(mockUploadResult);

      // Mock the generation response with failure
      mockedAxios.create.mockReturnValue({
        post: jest.fn().mockResolvedValue({
          data: {
            sdGenerationJob: { generationId: mockGenerationId }
          }
        }),
        get: jest.fn().mockResolvedValue({
          data: {
            generations_by_pk: {
              status: 'FAILED'
            }
          }
        })
      } as any);

      await expect(LeonardoService.generateImageFromImage(mockRequest))
        .rejects
        .toThrow('Image generation failed');
    });

    it('should handle generation timeout', async () => {
      // Mock the upload image response
      jest.spyOn(LeonardoService, 'uploadImage').mockResolvedValue(mockUploadResult);

      // Mock the generation response with pending status
      mockedAxios.create.mockReturnValue({
        post: jest.fn().mockResolvedValue({
          data: {
            sdGenerationJob: { generationId: mockGenerationId }
          }
        }),
        get: jest.fn().mockResolvedValue({
          data: {
            generations_by_pk: {
              status: 'PENDING'
            }
          }
        })
      } as any);

      await expect(LeonardoService.generateImageFromImage(mockRequest))
        .rejects
        .toThrow('Generation timeout');
    });
  });
}); 