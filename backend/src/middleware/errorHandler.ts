import { Request, Response, NextFunction } from 'express';
import { LeonardoApiError } from '../types/index';

export const errorHandler = (
  error: Error | LeonardoApiError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error('Error:', error);

  if ((error as LeonardoApiError).statusCode) {
    const apiError = error as LeonardoApiError;
    return res.status(apiError.statusCode).json({
      error: apiError.error,
      message: apiError.message
    });
  }

  res.status(500).json({
    error: 'INTERNAL_SERVER_ERROR',
    message: 'An unexpected error occurred'
  });
}; 