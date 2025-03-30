import { Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';
import { LeonardoService } from '../services/leonardoService';
import { GenerateImageRequest, ImageFromImageRequest } from '../types/index';

export const validateGenerateImage = [
  body('prompt')
    .trim()
    .notEmpty()
    .withMessage('Prompt is required')
    .isLength({ max: 500 })
    .withMessage('Prompt must be less than 500 characters'),
  body('baseImage')
    .optional()
    .isURL()
    .withMessage('Base image must be a valid URL'),
  body('negativePrompt')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Negative prompt must be less than 500 characters'),
];

export const validateImageFromImage = [
  body('prompt')
    .trim()
    .notEmpty()
    .withMessage('Prompt is required')
    .isLength({ max: 500 })
    .withMessage('Prompt must be less than 500 characters'),
  body('imageUrl')
    .trim()
    .notEmpty()
    .withMessage('Image URL is required')
    .custom((value) => {
      // Accept both data URLs and regular URLs
      return value.startsWith('data:image/') || /^https?:\/\//.test(value);
    })
    .withMessage('Image URL must be a valid URL or data URL'),
  body('negativePrompt')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Negative prompt must be less than 500 characters'),
  body('strength')
    .optional()
    .isFloat({ min: 0, max: 1 })
    .withMessage('Strength must be between 0 and 1'),
];

export const generateImage = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const request: GenerateImageRequest = {
      prompt: req.body.prompt,
      baseImage: req.body.baseImage,
      negativePrompt: req.body.negativePrompt,
    };

    console.log('Request:', request);
    const result = await LeonardoService.generateImage(request);
    res.json(result);
    console.log('Response:', result);
    
  } catch (error) {
    next(error);
  }
};

export const generateImageFromImage = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    console.log('Received image-from-image generation request');
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.error('Validation errors:', errors.array());
      res.status(400).json({ 
        error: 'VALIDATION_ERROR',
        message: 'Invalid request parameters',
        details: errors.array() 
      });
      return;
    }

    // Validate required fields
    const { prompt, imageUrl } = req.body;
    if (!prompt || !imageUrl) {
      console.error('Missing required fields:', { prompt: !!prompt, imageUrl: !!imageUrl });
      res.status(400).json({ 
        error: 'MISSING_FIELDS',
        message: 'Missing required fields: prompt and imageUrl are required' 
      });
      return;
    }

    // Log image type without logging entire content
    console.log('Image data type:', typeof imageUrl === 'string' ? 
      (imageUrl.startsWith('data:image/') ? 'data URL' : 'URL') : 
      typeof imageUrl);

    const request: ImageFromImageRequest = {
      prompt: req.body.prompt,
      imageUrl: req.body.imageUrl,
      negativePrompt: req.body.negativePrompt,
      strength: req.body.strength,
    };

    console.log('Calling LeonardoService with image-to-image request');
    const result = await LeonardoService.generateImageFromImage(request);
    console.log('Generation successful, returning result');
    res.json(result);
  } catch (error) {
    console.error('Error in generateImageFromImage controller:', error);
    if (error instanceof Error) {
      res.status(500).json({ 
        error: 'GENERATION_ERROR',
        message: error.message 
      });
    } else {
      next(error);
    }
  }
}; 