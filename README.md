# APITalk

APITalk is an AI-powered API design tool that enables natural language specification generation. It supports both English and Chinese interfaces, making API design more intuitive and accessible.

## Features

- 🤖 Natural Language API Specification Generation
- 🌐 Multilingual Support (English & Chinese)
- 📝 Interactive Documentation
- 📄 YAML Documentation Export
- 🔄 Real-time Preview

## Prerequisites

- Node.js 18+
- OpenAI API Key

## Getting Started

### Local Development

1. Clone the repository
```bash
git clone <repository-url>
cd apitalk
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
cp .env.example .env
```
Edit `.env` and add your OpenAI API credentials:
```
OPENAI_API_KEY=your_api_key_here
OPENAI_BASE_URL=your_base_url_here
OPENAI_MODEL=gpt-3.5-turbo
```

4. Start the development server
```bash
npm run dev
```

### Docker Deployment

1. Set up environment variables as described above

2. Build and start the container
```bash
docker-compose up --build -d
```

3. Access the application at `http://localhost:3000`

### Vercel Deployment

1. Push your code to GitHub

2. Import your repository in Vercel

3. Configure environment variables in Vercel Dashboard:
   - Go to Project Settings
   - Navigate to Environment Variables
   - Add the required variables from `.env.example`

4. Deploy

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| OPENAI_API_KEY | Your OpenAI API key | Yes |
| OPENAI_BASE_URL | OpenAI API base URL | Yes |
| OPENAI_MODEL | OpenAI model to use | Yes |

## Commands

```bash
# Development
npm run dev

# Build
npm run build

# Production
npm start

# Linting
npm run lint

# Docker
docker-compose up --build    # Build and start
docker-compose up -d         # Start in background
docker-compose down         # Stop
docker-compose logs -f      # View logs
```

## License

[MIT License](LICENSE)
