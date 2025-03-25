import { Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';
import { LeonardoService } from '../services/leonardoService';
import { GenerateImageRequest } from '../types';

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