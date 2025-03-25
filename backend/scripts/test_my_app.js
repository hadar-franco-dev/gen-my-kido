// Import dotenv to load environment variables
import 'dotenv/config';
import axios from 'axios';

const API_URL = 'http://localhost:3001';

async function testImageGeneration() {
    try {
        console.log('Testing Image Generation API...');
        console.log('API URL:', API_URL);
        
        const requestData = {
            prompt: "A beautiful sunset over a mountain landscape, digital art style",
            negativePrompt: "blur, darkness, low quality"
        };
        
        console.log('Sending request:', requestData);
        const response = await axios.post(`${API_URL}/api/images/generate`, requestData, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        console.log('Response from API:');
        console.log(JSON.stringify(response.data, null, 2));
        
    } catch (error) {
        console.error('Error occurred:');
        if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            console.error('Response error:', {
                status: error.response.status,
                data: error.response.data
            });
        } else if (error.request) {
            // The request was made but no response was received
            console.error('No response received:', error.message);
        } else {
            // Something happened in setting up the request that triggered an Error
            console.error('Request setup error:', error.message);
        }
    }
}

// First make sure the server is running
console.log('Make sure your server is running on', API_URL);
console.log('Starting test in 2 seconds...');

setTimeout(() => {
    testImageGeneration();
}, 2000);
