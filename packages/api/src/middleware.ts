import { NextRequest } from 'next/server';
import { corsMiddleware } from './middleware/cors';

export function middleware(request:, NextRequest) {
  return corsMiddleware(request);
}

export const config = {
  matcher: '/api/:path*',
};