# Wonderful Chat App

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/harshil1712/wonderful-chat-app)

A real-time AI chat application built with TanStack Start and deployed on Cloudflare Workers. Chat with multiple AI models through a clean, streaming interface.

## Features

- **Multi-model AI chat** - Choose from 5 different AI models across two providers
- **Streaming responses** - Real-time text streaming via Server-Sent Events (SSE)
- **Model persistence** - Your selected model is saved and restored across sessions
- **Auto-scrolling** - Chat window automatically scrolls to the latest messages
- **Auto-resizing input** - Text area grows as you type multi-line messages
- **Keyboard shortcuts** - Press Enter to send, Shift+Enter for new lines

## Tech Stack

- **Framework**: React 19 with TanStack Start (full-stack React framework)
- **Router**: TanStack Router with file-based routing
- **AI Integration**: `@tanstack/ai` + `@cloudflare/tanstack-ai` for streaming chat
- **Deployment**: Cloudflare Workers with Workers AI binding
- **Styling**: Tailwind CSS v4 + Cloudflare Kumo components
- **Build Tool**: Vite 7
- **Language**: TypeScript

## Available Models

| Model | Provider | Description |
|-------|----------|-------------|
| GLM 4.7 Flash (default) | Workers AI | Fast, efficient model from Zhipu AI |
| Llama 3.3 70B | Workers AI | Meta's powerful open-source model |
| Granite 4.0 Micro | Workers AI | IBM's compact enterprise model |
| GPT OSS 20B | Workers AI | Open-source GPT variant |
| GPT-4o | OpenAI | OpenAI's flagship model via AI Gateway |

## Getting Started

### Prerequisites

- [Cloudflare account](https://dash.cloudflare.com/sign-up) with Workers AI access
- Node.js 18+ and npm

### Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/harshil1712/wonderful-chat-app.git
   cd wonderful-chat-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure AI Gateway** (Required)
   
   The app uses Cloudflare AI Gateway to route requests. You need to create a gateway in your Cloudflare dashboard:
   
   - Go to [Cloudflare Dashboard](https://dash.cloudflare.com) → AI → AI Gateway
   - Click "Create Gateway"
   - Name it `wonderful-chat-gateway`
   - Add endpoints for:
     - **Workers AI**: Select "Workers AI" as the provider
     - **OpenAI**: Select "OpenAI" as the provider and add your OpenAI API key
   
   The app is configured to use `wonderful-chat-gateway` in `src/routes/api.chat.tsx:34,40`.

4. **Run locally**
   ```bash
   npm run dev
   ```
   
   The app will be available at `http://localhost:3000`

5. **Deploy to Cloudflare Workers**
   ```bash
   npm run deploy
   ```

### Available Scripts

- `npm run dev` - Start development server on port 3000
- `npm run build` - Build for production
- `npm run deploy` - Build and deploy to Cloudflare Workers
- `npm run test` - Run tests with Vitest
- `npm run preview` - Build and preview locally
- `npm run cf-typegen` - Generate Cloudflare Worker types

## Project Structure

```
wonderful-chat-app/
├── src/
│   ├── config/
│   │   └── models.ts           # AI model configurations
│   ├── components/
│   │   ├── Header.tsx          # App header
│   │   ├── ChatMessage.tsx     # Message bubble component
│   │   ├── ChatInput.tsx       # Text input with auto-resize
│   │   └── ModelSelector.tsx   # AI model dropdown
│   ├── routes/
│   │   ├── __root.tsx          # Root layout
│   │   ├── index.tsx           # Main chat page
│   │   └── api.chat.tsx        # Server-side chat API
│   ├── router.tsx              # Router configuration
│   └── styles.css              # Global styles
├── public/                      # Static assets
├── wrangler.jsonc              # Cloudflare Workers config
├── vite.config.ts              # Vite configuration
└── package.json
```

## How It Works

### Client-Side (`src/routes/index.tsx`)
- Uses `useChat` hook from `@tanstack/ai-react` to manage chat state
- Establishes SSE connection to `/api/chat` for streaming responses
- Selected model ID is persisted in localStorage and sent with each request

### Server-Side (`src/routes/api.chat.tsx`)
- POST handler receives messages and model selection
- Validates model and creates appropriate adapter:
  - **OpenAI models**: Uses `createOpenAiChat` with AI Gateway
  - **Workers AI models**: Uses `createWorkersAiChat` with direct binding
- Returns streaming response via Server-Sent Events

## Configuration

### Cloudflare Workers (`wrangler.jsonc`)
- **AI Binding**: Provides access to Workers AI and AI Gateway
- **Node.js Compatibility**: Enabled via `nodejs_compat` flag
- **Observability**: Application monitoring enabled

### Customization

To add or modify AI models, edit `src/config/models.ts:3-27`. Each model needs:
- `id`: Model identifier (e.g., `@cf/meta/llama-3.3-70b-instruct-fp8-fast`)
- `name`: Display name shown in the UI
- `provider`: Either `"workersai"` or `"openai"`

## Learn More

- [TanStack Start Documentation](https://tanstack.com/start)
- [Cloudflare Workers AI](https://developers.cloudflare.com/workers-ai/)
- [Cloudflare AI Gateway](https://developers.cloudflare.com/ai-gateway/)
- [TanStack Router](https://tanstack.com/router)
