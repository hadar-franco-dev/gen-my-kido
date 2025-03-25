import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const LEONARDO_API_URL = process.env.LEONARDO_API_URL;
const LEONARDO_API_KEY = process.env.LEONARDO_API_KEY;

describe('Leonardo API Integration Tests', () => {
  test('API key is properly configured', () => {
    expect(LEONARDO_API_KEY).toBeDefined();
    expect(LEONARDO_API_KEY).not.toBe('');
  });

  test('Can fetch user information', async () => {
    const response = await axios.get(`${LEONARDO_API_URL}/me`, {
      headers: {
        'Authorization': `Bearer ${LEONARDO_API_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    expect(response.status).toBe(200);
    expect(response.data).toBeDefined();
  });

  test('Can initiate a basic image generation', async () => {
    const generationParams = {
      prompt: 'A simple test image of a blue sky',
      modelId: 'ac614f96-1082-45bf-be9d-757f2d31c174', // Using a default model ID
      num_images: 1,
      width: 512,
      height: 512,
    };

    const response = await axios.post(
      `${LEONARDO_API_URL}/generations`,
      generationParams,
      {
        headers: {
          'Authorization': `Bearer ${LEONARDO_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    expect(response.status).toBe(200);
    expect(response.data.sdGenerationJob).toBeDefined();
    expect(response.data.sdGenerationJob.generationId).toBeDefined();
  });
}); 