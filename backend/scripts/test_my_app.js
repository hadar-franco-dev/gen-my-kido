// Import dotenv to load environment variables
import 'dotenv/config';
import axios from 'axios';

const LEONARDO_API_URL = 'https://cloud.leonardo.ai/api/rest/v1';

async function testImageToImage() {
    try {
        console.log('Testing Image-to-Image Generation API...');
        console.log('API URL:', LEONARDO_API_URL);
        
        const requestData = {
            prompt: "Transform this landscape into a watercolor painting",
            negativePrompt: "blur, darkness, low quality",
            imageUrl: "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
            modelId: "ac614f96-1082-45bf-be9d-757f2d31c174",
            width: 512,
            height: 512,
            num_images: 1,
            strength: 0.7,
            public: false,
            promptMagic: false
        };
        
        console.log('Sending request:', requestData);
        const response = await axios.post(`${LEONARDO_API_URL}/generations/image-to-image`, requestData, {
            headers: {
                'accept': 'application/json',
                'content-type': 'application/json',
                'authorization': `Bearer ${process.env.LEONARDO_API_KEY}`
            }
        });
        
        console.log('Generation initiated. Response:', JSON.stringify(response.data, null, 2));
        
        // Get the generation result
        const generationId = response.data.sdGenerationJob.generationId;
        console.log('Checking generation status for ID:', generationId);
        
        // Poll for the result
        let attempts = 0;
        const maxAttempts = 10;
        while (attempts < maxAttempts) {
            const statusResponse = await axios.get(`${LEONARDO_API_URL}/generations/${generationId}`, {
                headers: {
                    'accept': 'application/json',
                    'authorization': `Bearer ${process.env.LEONARDO_API_KEY}`
                }
            });
            
            const generation = statusResponse.data.generations_by_pk;
            console.log('Generation status:', generation.status);
            
            if (generation.status === 'COMPLETE') {
                console.log('Generation complete! Images:', generation.generated_images);
                break;
            } else if (generation.status === 'FAILED') {
                throw new Error('Generation failed');
            }
            
            attempts++;
            await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds between checks
        }
        
        if (attempts >= maxAttempts) {
            throw new Error('Generation timed out');
        }
        
    } catch (error) {
        console.error('Error occurred:');
        if (error.response) {
            console.error('Response error:', {
                status: error.response.status,
                data: error.response.data
            });
        } else if (error.request) {
            console.error('No response received:', error.message);
        } else {
            console.error('Request setup error:', error.message);
        }
    }
}

// Make sure your LEONARDO_API_KEY is set in .env
console.log('Starting test in 2 seconds...');
console.log('Make sure LEONARDO_API_KEY is set in your .env file');

setTimeout(async () => {
    console.log('\n=== Testing Image-to-Image Generation ===\n');
    await testImageToImage();
}, 2000);
