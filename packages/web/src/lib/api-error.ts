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
  let errorMessage = 'An unexpected error occurred';
  let errorDetails: any = undefined;

  // Handle ApiError instances
  if (error instanceof ApiError) {
    status = error.status;
    errorMessage = error.message;
    errorDetails = error.details;
  }
  // Handle standard Error instances
  else if (error instanceof Error) {
    errorMessage = error.message || errorMessage;
  }
  // Handle PostgreSQL specific errors when error is a plain object
  else if (typeof error === 'object' && error !== null) {
    const pgError = error as any;
    if (pgError.code === '23505') { // unique violation
      status = 409;
      errorMessage = 'A record with this data already exists';
    } else if (pgError.code === '23503') { // foreign key violation
      status = 400;
      errorMessage = 'Referenced record does not exist';
    } else if (pgError.code === '22P02') { // invalid text representation
      status = 400;
      errorMessage = 'Invalid data format';
    }
  }

  const errorResponse = {
    success: false,
    error: errorMessage,
    ...(errorDetails && { details: errorDetails }),
  };

  return NextResponse.json(errorResponse, { status });
}

export { ApiError } from '@/utils/error-handler';
