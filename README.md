# GenMyKido - AI Image Generation Platform

A full-stack application that leverages Leonardo.ai's API to generate AI images based on user prompts.

## Project Structure

```
.
├── frontend/          # Next.js frontend application
├── backend/          # Express.js backend API
│   ├── src/
│   │   ├── config/   # Configuration files
│   │   ├── controllers/  # Request handlers
│   │   ├── middleware/   # Express middleware
│   │   ├── routes/      # API routes
│   │   ├── services/    # Business logic
│   │   └── types/       # TypeScript type definitions
│   └── tests/          # Test files
```

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Leonardo.ai API key

### Environment Setup

1. Backend Setup:
   ```bash
   cd backend
   cp .env.example .env
   # Add your Leonardo API key to .env
   npm install
   npm run dev
   ```

2. Frontend Setup:
   ```bash
   cd frontend
   cp .env.example .env.local
   npm install
   npm run dev
   ```

### API Endpoints

#### Generate Image
- **POST** `/api/images/generate`
- **Body**:
  ```json
  {
    "prompt": "Your image description",
    "negativePrompt": "Things to avoid in the image (optional)"
  }
  ```
- **Response**:
  ```json
  {
    "imageUrl": "URL to generated image",
    "generationId": "Unique generation ID"
  }
  ```

### Testing

Run the test suite:
```bash
cd backend
npm test
```

## Features

- Image generation using Leonardo.ai API
- Real-time generation status updates
- Error handling and validation
- Rate limiting
- TypeScript support
- Automated testing

## Tech Stack

- **Frontend**: Next.js, React, TypeScript
- **Backend**: Express.js, TypeScript
- **Testing**: Jest
- **API**: Leonardo.ai

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request
