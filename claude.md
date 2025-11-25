# Jarbas AI - Cloud Architecture & Deployment Guide

## Project Overview

**Jarbas** is an AI-powered conversational agent configuration platform that enables users to design, configure, and test chatbot behaviors. Built with React 18 and TypeScript, it provides a visual interface for configuring AI assistants with real-time preview capabilities.

### Core Purpose

- Visual configuration interface for AI chatbot behavior and personality
- Real-time chat preview widget for testing configurations
- Support for both AI-powered and templated conversation modes
- Audio recording/transcription and text-to-speech capabilities

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         Client (Browser)                         │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐  │
│  │   React 18 +    │  │   Tailwind CSS  │  │   shadcn/ui     │  │
│  │   TypeScript    │  │   + Radix UI    │  │   Components    │  │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘  │
│                                                                   │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │                    State Management                          │ │
│  │  • React Query (TanStack)  • Custom Hooks  • Context API    │ │
│  │  • localStorage Persistence                                  │ │
│  └─────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      External Services                           │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │                    OpenAI API                                │ │
│  │  • GPT-4.1 (Chat Completions)                               │ │
│  │  • Whisper (Audio Transcription)                            │ │
│  │  • TTS-1 (Text-to-Speech)                                   │ │
│  └─────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| **Framework** | React 18.3.1 + TypeScript 5.5.3 |
| **Build Tool** | Vite 5.4.1 (SWC transpilation) |
| **Styling** | Tailwind CSS 3.4.11 |
| **UI Components** | shadcn/ui + Radix UI primitives |
| **State** | React Query + Custom Hooks + Context API |
| **Forms** | react-hook-form + Zod validation |
| **Routing** | react-router-dom 6.26.2 |
| **Icons** | Lucide React + Tabler Icons |
| **AI Integration** | OpenAI API (GPT-4.1, Whisper, TTS) |

---

## Cloud Deployment Options

### Option 1: Static Hosting (Recommended)

Since Jarbas is a client-side SPA with no backend, it can be deployed to any static hosting service.

#### AWS S3 + CloudFront

```bash
# Build the project
npm run build

# Sync to S3
aws s3 sync dist/ s3://your-bucket-name --delete

# Invalidate CloudFront cache
aws cloudfront create-invalidation --distribution-id YOUR_DIST_ID --paths "/*"
```

**Infrastructure (Terraform/CloudFormation):**
- S3 Bucket (static website hosting)
- CloudFront Distribution (CDN)
- ACM Certificate (SSL)
- Route 53 (DNS)

#### Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

#### Netlify

```bash
# Install Netlify CLI
npm i -g netlify-cli

# Deploy
netlify deploy --prod --dir=dist
```

#### Cloudflare Pages

```bash
# Connect repository via Cloudflare Dashboard
# Build command: npm run build
# Output directory: dist
```

### Option 2: Containerized Deployment

For environments requiring containerization:

```dockerfile
# Dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

```nginx
# nginx.conf
server {
    listen 80;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

**Deploy to:**
- AWS ECS/Fargate
- Google Cloud Run
- Azure Container Apps
- Kubernetes (EKS/GKE/AKS)

---

## Environment Configuration

### Required Environment Variables

```env
# .env.production
VITE_OPENAI_API_KEY=sk-...
VITE_API_BASE_URL=https://api.openai.com/v1
```

### Security Considerations

> **Critical:** The current implementation has the OpenAI API key hardcoded in `src/services/openaiService.ts`. For production:

1. **Option A: Backend Proxy (Recommended)**
   - Create an API proxy to handle OpenAI requests
   - Store API keys server-side
   - Implement rate limiting and authentication

2. **Option B: Environment Variables**
   - Move API key to environment variables
   - Use build-time injection
   - Note: Still exposed in client bundle

```typescript
// Recommended: Backend proxy pattern
const API_BASE_URL = import.meta.env.VITE_API_PROXY_URL || '/api';

export const createChatCompletion = async (messages: Message[]) => {
  const response = await fetch(`${API_BASE_URL}/chat/completions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages })
  });
  return response.json();
};
```

---

## CI/CD Pipeline

### GitHub Actions Example

```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run linting
        run: npm run lint

      - name: Build
        run: npm run build
        env:
          VITE_OPENAI_API_KEY: ${{ secrets.OPENAI_API_KEY }}

      - name: Deploy to S3
        uses: jakejarvis/s3-sync-action@master
        with:
          args: --delete
        env:
          AWS_S3_BUCKET: ${{ secrets.AWS_S3_BUCKET }}
          AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
          AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          SOURCE_DIR: 'dist'
```

---

## Performance Optimization

### Build Optimizations

```typescript
// vite.config.ts
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-ui': ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu'],
          'vendor-query': ['@tanstack/react-query'],
        }
      }
    },
    sourcemap: false,
    minify: 'terser'
  }
});
```

### CDN & Caching Strategy

| Asset Type | Cache Policy |
|------------|--------------|
| HTML | `no-cache` (always revalidate) |
| JS/CSS (hashed) | `max-age=31536000, immutable` |
| Images/Fonts | `max-age=31536000` |
| API Responses | `no-store` |

---

## Monitoring & Observability

### Recommended Stack

- **Error Tracking:** Sentry
- **Analytics:** Plausible / PostHog
- **Performance:** Web Vitals / Lighthouse CI
- **Uptime:** Better Uptime / Pingdom

### Sentry Integration

```typescript
// src/main.tsx
import * as Sentry from '@sentry/react';

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  environment: import.meta.env.MODE,
  integrations: [
    Sentry.browserTracingIntegration(),
    Sentry.replayIntegration()
  ],
  tracesSampleRate: 0.1,
  replaysSessionSampleRate: 0.1
});
```

---

## Scaling Considerations

### Current Architecture Limitations

1. **Client-Side State:** All configuration stored in localStorage
2. **No User Authentication:** Single-user experience
3. **Direct API Calls:** OpenAI API called directly from client

### Recommended Production Architecture

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Client    │────▶│   CDN/Edge  │────▶│   Origin    │
│  (Browser)  │     │ (CloudFront)│     │  (S3/GCS)   │
└─────────────┘     └─────────────┘     └─────────────┘
       │
       ▼
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  API Gateway│────▶│  Backend    │────▶│   OpenAI    │
│  (Rate Limit│     │  (Lambda/   │     │    API      │
│   + Auth)   │     │   Cloud Run)│     │             │
└─────────────┘     └─────────────┘     └─────────────┘
       │
       ▼
┌─────────────┐
│  Database   │
│ (DynamoDB/  │
│  Firestore) │
└─────────────┘
```

### Multi-Tenant Considerations

For scaling to multiple users/organizations:

1. **Authentication:** Auth0 / Clerk / Supabase Auth
2. **Database:** PostgreSQL / MongoDB for configuration storage
3. **API Layer:** Node.js/Express or serverless functions
4. **Rate Limiting:** Per-user quotas for OpenAI API usage
5. **Billing:** Stripe integration for usage-based pricing

---

## Cost Estimation

### Static Hosting (Low Traffic)

| Service | Monthly Cost |
|---------|--------------|
| S3 Storage | ~$0.50 |
| CloudFront | ~$1-5 |
| Route 53 | $0.50 |
| **Total** | **~$2-6/month** |

### With Backend Proxy

| Service | Monthly Cost |
|---------|--------------|
| Static Hosting | ~$5 |
| Lambda/Cloud Run | ~$10-50 |
| API Gateway | ~$5-20 |
| Database | ~$10-25 |
| **Total** | **~$30-100/month** |

### OpenAI API Costs (Variable)

| Model | Cost |
|-------|------|
| GPT-4.1 | ~$0.002/1K tokens |
| Whisper | $0.006/minute |
| TTS-1 | $0.015/1K chars |

---

## Quick Start Commands

```bash
# Development
npm run dev              # Start dev server (port 8080)

# Production Build
npm run build            # Build for production
npm run preview          # Preview production build

# Code Quality
npm run lint             # Run ESLint

# Deployment (example with Vercel)
npx vercel --prod
```

---

## References

- [Vite Documentation](https://vitejs.dev/)
- [React Documentation](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [OpenAI API Reference](https://platform.openai.com/docs/api-reference)
- [AWS S3 Static Hosting](https://docs.aws.amazon.com/AmazonS3/latest/userguide/WebsiteHosting.html)
