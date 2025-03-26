# GenMyKido Backend

This directory will contain the backend services for the GenMyKido application.

## Planned Features

- Authentication and authorization
- Image storage and management
- OpenAI API integration
- User preferences and settings
- Analytics and logging

## Technology Stack (Planned)

- Node.js/Express.js or NestJS
- PostgreSQL for data persistence
- Redis for caching
- AWS S3 for image storage
- Docker for containerization

## Getting Started

Backend implementation coming soon...

# Backend Service

This service provides an API for generating images using the Leonardo AI API.

## Features

### 1. Text-to-Image Generation
Generate images from text prompts:

```bash
POST /api/images/generate

{
  "prompt": "A beautiful sunset over mountains",
  "negativePrompt": "blurry, low quality" // optional
}
```

### 2. Image-to-Image Generation
Generate new images based on a source image:

```bash
POST /api/images/generate-from-image

{
  "prompt": "Transform this cat into a lion",
  "imageUrl": "https://example.com/cat.jpg",
  "negativePrompt": "blurry, low quality",  // optional
  "strength": 0.7  // optional, controls how much the original image influences the result (0-1)
}
```

## Response Format

Both endpoints return the same response format:

```json
{
  "imageUrl": "https://cdn.leonardo.ai/generated-image.jpg",
  "generationId": "generation-id"
}
```

## Rate Limiting

All image generation endpoints are rate-limited to 10 requests per minute per IP address.

## Error Handling

The API returns appropriate HTTP status codes and error messages:

- `400`: Invalid request (e.g., missing required fields, invalid parameters)
- `429`: Too many requests (rate limit exceeded)
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

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your Leonardo AI API key
```

3. Run tests:
```bash
npm test
```

4. Start development server:
```bash
npm run dev
```

## Testing

The service includes comprehensive tests for both text-to-image and image-to-image generation. Run tests with:

```bash
npm test
```

Or run tests in watch mode:

```bash
npm run test:watch
``` 