import { Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';
import { LeonardoService } from '../services/leonardoService';
import { GenerateImageRequest, ImageFromImageRequest } from '../types';

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
    .isURL()
    .withMessage('Image URL must be a valid URL'),
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
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const request: ImageFromImageRequest = {
      prompt: req.body.prompt,
      imageUrl: req.body.imageUrl,
      negativePrompt: req.body.negativePrompt,
      strength: req.body.strength,
    };

    console.log('Request:', request);
    const result = await LeonardoService.generateImageFromImage(request);
    res.json(result);
    console.log('Response:', result);
    
  } catch (error) {
    next(error);
  }
}; 