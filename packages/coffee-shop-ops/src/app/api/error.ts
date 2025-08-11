import { NextResponse } from 'next/server';
import { ApiError } from '@/utils/error-handler';

/**
 * Global error handler for API routes
 * This function will catch any errors thrown in API routes and format them consistently
 */
export function handleRouteError(error: unknown): NextResponse {
  console.error('API Error:', error);
  
  // Determine appropriate status code and error details
  let status = 500;
  let errorName = 'Error';
  let errorMessage = 'An unexpected error occurred';
  let errorDetails: any = undefined;

  // Handle ApiError instances
  if (error instanceof ApiError) {
    status = error.status;
    errorName = error.name;
    errorMessage = error.message;
    errorDetails = error.details;
  } 
  // Handle standard Error instances
  else if (error instanceof Error) {
    errorName = error.name;
    errorMessage = error.message;
  }
  // Handle PostgreSQL specific errors
  else if (typeof error === 'object' && error !== null) {
    const pgError = error as any;
    if (pgError.code === '23505') { // PostgreSQL unique constraint violation
      status = 409; // Conflict
      errorMessage = 'A record with this data already exists';
    } else if (pgError.code === '23503') { // PostgreSQL foreign key violation
      status = 400; // Bad Request
      errorMessage = 'Referenced record does not exist';
    } else if (pgError.code === '22P02') { // PostgreSQL invalid text representation
      status = 400; // Bad Request
      errorMessage = 'Invalid data format';
    }
  }

  // Create standardized error response
  const errorResponse = {
    error: errorMessage,
    ...(errorDetails && { details: errorDetails })
  };

  // Add CORS headers for cross-origin requests
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };

  // Return formatted error response
  return NextResponse.json(errorResponse, { status, headers });
}