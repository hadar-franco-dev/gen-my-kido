import dotenv from 'dotenv';
// Load environment variables before any other imports
dotenv.config();

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import imageRoutes from './routes/imageRoutes';
import uploadRoutes from './routes/uploadRoutes';
import { errorHandler } from './middleware/errorHandler';

const app = express();
const port = process.env.PORT || 3001;
const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'];

// Middleware
app.use(helmet());
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));

// Routes
app.use('/api/images', imageRoutes);
app.use('/api/images', uploadRoutes);

// Error handling
app.use(errorHandler);

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
}); 