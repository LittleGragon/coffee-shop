// This file is only here to satisfy Next.js App Router's error boundary expectation
// for the /api segment (error.ts[x] must be a Client Component).
// Real API error handling lives in src/lib/api-error.ts and should be imported by routes:
//
//   import { handleRouteError } from '@/lib/api-error';
//
'use client';
export {};