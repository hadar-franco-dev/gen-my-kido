import { Request, Response, NextFunction } from 'express';
import multer, { FileFilterCallback } from 'multer';
import { LeonardoService } from '../services/leonardoService';

// Extend Express Request to include file from multer
interface MulterRequest extends Request {
  file?: Express.Multer.File;
}

// Configure multer for memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
    // Accept only image files
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  },
}).single('image');

export const uploadImage = async (req: MulterRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    console.log('Starting image upload...');
    
    // Handle the file upload using multer
    await new Promise<void>((resolve, reject) => {
      upload(req, res, (err: any) => {
        if (err) {
          console.error('Multer upload error:', err);
          reject(err);
        } else {
          resolve();
        }
      });
    });

    if (!req.file) {
      console.error('No file in request');
      res.status(400).json({ error: 'No image file provided' });
      return;
    }

    console.log('File received:', {
      filename: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size
    });

    // Convert the buffer to base64
    const base64Image = req.file.buffer.toString('base64');
    const dataUrl = `data:${req.file.mimetype};base64,${base64Image}`;

    console.log('Uploading to Leonardo API...');
    
    // Upload to Leonardo API
    try {
      const uploadResult = await LeonardoService.uploadImage(dataUrl);
      console.log('Upload successful, got result:', uploadResult);
      
      // Return the URL that can be used by Leonardo API
      res.json({ 
        imageId: uploadResult.id,
        imageUrl: uploadResult.url 
      });
    } catch (uploadError) {
      console.error('Leonardo API upload error:', uploadError);
      if (uploadError instanceof Error) {
        res.status(500).json({ error: uploadError.message });
      } else {
        res.status(500).json({ error: 'Failed to upload image to Leonardo API' });
      }
    }
  } catch (error) {
    console.error('Upload controller error:', error);
    next(error);
  }
}; 