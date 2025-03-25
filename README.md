# GenMyKido - AI Image Generator

An AI-powered image generator built with Next.js that helps create unique images for children's stories. This project uses OpenAI's DALL-E model to generate images based on text prompts.

## Project Structure

The project is divided into two main parts:

```
/
├── frontend/          # Next.js frontend application
│   ├── src/          # Source code
│   │   ├── app/      # Next.js app router
│   │   ├── components/  # React components
│   │   └── lib/      # Utilities and configurations
│   ├── public/       # Static assets
│   └── ...          # Configuration files
│
└── backend/          # Backend services (coming soon)
```

## Features

- Image upload (drag-and-drop and click-to-browse)
- AI image generation with text prompts
- Modern, responsive UI with animations
- Download generated images
- Prompt suggestions

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/hadar-franco-dev/gen-my-kido.git
cd gen-my-kido
```

2. Set up the frontend:
```bash
cd frontend
npm install
```

3. Create a `.env.local` file in the frontend directory and add your OpenAI API key:
```bash
OPENAI_API_KEY=your_api_key_here
```

4. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Technologies Used

### Frontend
- [Next.js](https://nextjs.org) - React framework
- [OpenAI API](https://openai.com) - AI image generation
- [Tailwind CSS](https://tailwindcss.com) - Styling
- [Shadcn/ui](https://ui.shadcn.com) - UI components
- [Framer Motion](https://www.framer.com/motion) - Animations

### Backend (Planned)
- Node.js/Express.js or NestJS
- PostgreSQL
- Redis
- AWS S3
- Docker

## Learn More

To learn more about the technologies used in this project:

- [Next.js Documentation](https://nextjs.org/docs)
- [OpenAI API Documentation](https://platform.openai.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

## Deployment

The frontend can be deployed using [Vercel Platform](https://vercel.com/new) from the creators of Next.js.

Check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
