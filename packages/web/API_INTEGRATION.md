# API Integration Guide

This document explains how the API interfaces from `packages/api` have been integrated with `packages/web`.

## Overview

The Coffee Shop Buddy application now has API interfaces from the API package available in the web package. This is achieved through a proxy configuration that forwards API requests from the web application to the API server.

## Setup

1. Make sure both packages are installed:
   ```bash
   cd packages/web
   npm install
   cd ../api
   npm install
   ```

2. Start both servers:
   ```bash
   # Terminal 1: Start the API server
   cd packages/api
   npm run dev
   
   # Terminal 2: Start the web server
   cd packages/web
   npm run dev
   ```

## How It Works

The web package is configured to proxy all requests to `/api/*` to the API server running on port 3001. This is set up in the `vite.config.ts` file:

```typescript
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:3001',
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/api/, ''),
    },
  },
},
```

This means that when your frontend code makes a request to `/api/menu`, it will be forwarded to `http://localhost:3001/menu` on the API server.

## API Endpoints

All API endpoints are available under the `/api` prefix. For example:

- `GET /api/menu` - Get all menu items
- `POST /api/orders` - Create a new order
- `GET /api/members?email=user@example.com` - Get a member by email

## Development Workflow

When developing:

1. Make changes to API routes in `packages/api/src/app/api/`
2. Make changes to frontend code in `packages/web/src/`
3. Test both together by running both servers

## Production Deployment

For production, you have two options:

1. Deploy both packages separately and configure the web server to proxy API requests to the API server.

2. Use a reverse proxy like Nginx to route requests to the appropriate server:
   - `/api/*` routes to the API server
   - All other routes to the web server

## Fallback to Mock Data

If the API server is unavailable, the web application can fall back to mock data by setting:

```
VITE_USE_MOCK_DATA=true
```

in your `.env` file.
