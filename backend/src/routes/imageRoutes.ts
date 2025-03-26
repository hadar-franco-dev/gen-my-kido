import { Router } from 'express';
import { generateImage, generateImageFromImage, validateGenerateImage, validateImageFromImage } from '../controllers/imageController';
import rateLimit from 'express-rate-limit';

const router = Router();

// Rate limiting: 10 requests per minute
const imageLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10,
  message: { error: 'TOO_MANY_REQUESTS', message: 'Too many requests, please try again later' }
});

router.post('/generate', imageLimiter, validateGenerateImage, generateImage);
router.post('/generate-from-image', imageLimiter, validateImageFromImage, generateImageFromImage);

export default router; 