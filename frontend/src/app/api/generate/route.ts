import { NextResponse } from 'next/server'

const LEONARDO_API_URL = process.env.LEONARDO_API_URL || 'https://cloud.leonardo.ai/api/rest/v1';
const LEONARDO_API_KEY = process.env.LEONARDO_API_KEY;

if (!LEONARDO_API_KEY) {
  throw new Error('Missing LEONARDO_API_KEY environment variable');
}

export async function POST(req: Request) {
  try {
    const { prompt, presetStyle, generationMode, imageGuidance, finetunedModel } = await req.json()

    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      )
    }

    const requestBody = {
      prompt,
      modelId: '2067ae52-33fd-4a82-bb92-c2c55e7d2786', // Updated model ID
      height: 1024,
      width: 1024,
      presetStyle,
      generationMode,
      imageGuidance,
      finetunedModel
    };

    // First, initiate the generation
    const generationResponse = await fetch(`${LEONARDO_API_URL}/generations`, {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'content-type': 'application/json',
        'authorization': `Bearer ${LEONARDO_API_KEY}`,
      },
      body: JSON.stringify(requestBody),
    });

    if (!generationResponse.ok) {
      const error = await generationResponse.json();
      throw new Error(error.message || 'Failed to generate image');
    }

    const generationData = await generationResponse.json();
    const generationId = generationData.sdGenerationJob.generationId;

    // Poll for the generation result
    let attempts = 0;
    const maxAttempts = 30;
    const delay = 2000; // 2 seconds

    while (attempts < maxAttempts) {
      const result = await fetch(`${LEONARDO_API_URL}/generations/${generationId}`, {
        headers: {
          'authorization': `Bearer ${LEONARDO_API_KEY}`,
        },
      });

      if (!result.ok) {
        throw new Error('Failed to check generation status');
      }

      const data = await result.json();
      
      if (data.generations_by_pk.status === 'COMPLETE') {
        return NextResponse.json({ 
          imageUrl: data.generations_by_pk.generated_images[0].url,
          generationId 
        });
      }

      if (data.generations_by_pk.status === 'FAILED') {
        throw new Error('Image generation failed');
      }

      await new Promise(resolve => setTimeout(resolve, delay));
      attempts++;
    }

    throw new Error('Generation timeout');
  } catch (error) {
    console.error('Error generating image:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to generate image' },
      { status: 500 }
    )
  }
} 