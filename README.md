# GenMyKido - AI Image Generation Platform

A full-stack application that leverages Leonardo.ai's API to generate and transform images using artificial intelligence.

## Features

- **Text-to-Image Generation**: Create unique images from textual descriptions
- **Image-to-Image Generation**: Transform existing images using AI
- **Real-time Progress Tracking**: Monitor generation status in real-time
- **Rate Limiting**: Protect API resources with intelligent rate limiting
- **Error Handling**: Comprehensive error handling and validation
- **TypeScript Support**: Full type safety across frontend and backend
- **Automated Testing**: Extensive test coverage for reliability

## Project Structure

```
.
├── frontend/          # Next.js frontend application
│   ├── src/
│   │   ├── app/      # Next.js app directory
│   │   ├── components/  # React components
│   │   ├── lib/     # Utility functions
│   │   └── types/   # TypeScript types
├── backend/          # Express.js backend API
│   ├── src/
│   │   ├── config/   # Configuration files
│   │   ├── controllers/  # Request handlers
│   │   ├── middleware/   # Express middleware
│   │   ├── routes/      # API routes
│   │   ├── services/    # Business logic
│   │   └── types/       # TypeScript types
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

## API Documentation

### 1. Text-to-Image Generation
Generate images from text descriptions:

```bash
POST /api/images/generate

{
  "prompt": "A beautiful sunset over mountains",
  "negativePrompt": "blurry, low quality" // optional
}
```

### 2. Image-to-Image Generation
Transform existing images:

```bash
POST /api/images/generate-from-image

{
  "prompt": "Transform this cat into a lion",
  "imageUrl": "https://example.com/cat.jpg",
  "negativePrompt": "blurry, low quality",  // optional
  "strength": 0.7  // optional, controls how much the original image influences the result (0-1)
}
```

### Response Format

All image generation endpoints return:

```json
{
  "imageUrl": "https://cdn.leonardo.ai/generated-image.jpg",
  "generationId": "generation-id"
}
```

### Error Handling

The API uses standard HTTP status codes:

- `400`: Invalid request (e.g., missing fields, invalid parameters)
- `429`: Rate limit exceeded (10 requests per minute)
- `500`: Server error

Error response format:

```json
{
  "errors": [
    {
      "msg": "Error message",
      "param": "field_name"
    }
  ]
}
```

## Development

### Running Tests

Backend tests:
```bash
cd backend
npm test          # Run tests once
npm run test:watch  # Run tests in watch mode
```

### API Documentation

For detailed API documentation, see:
- [Backend README](./backend/README.md)
- [API Documentation](./docs/api.md)

## Tech Stack

### Frontend
- Next.js 14
- React
- TypeScript
- Tailwind CSS
- Shadcn UI

### Backend
- Express.js
- TypeScript
- Jest for testing
- Leonardo.ai API

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Leonardo.ai](https://leonardo.ai/) for their powerful image generation API
- [Next.js](https://nextjs.org/) team for the amazing framework
- [Shadcn UI](https://ui.shadcn.com/) for the beautiful UI components
