import { NextResponse } from 'next/server';

/**
 * Standard API error response format
 */
export interface ApiErrorResponse {
  error: string;
  message: string;
  details?: any;
  status: number;
}

/**
 * Handles API errors consistently across all routes
 * Preserves original error information while providing a standardized response format
 */
export function handleApiError(error: any, defaultMessage = 'An unexpected error occurred'): NextResponse {
  console.error('API Error:', error);
  
  // Determine appropriate status code
  let status = 500;
  if (error.status) {
    status = error.status;
  } else if (error.code === '23505') { // PostgreSQL unique constraint violation
    status = 409; // Conflict
  } else if (error.code === '23503') { // PostgreSQL foreign key violation
    status = 400; // Bad Request
  } else if (error.code === '22P02') { // PostgreSQL invalid text representation
    status = 400; // Bad Request
  }

  // Create standardized error response
  const errorResponse: ApiErrorResponse = {
    error: error.name || 'Error',
    message: error.message || defaultMessage,
    status
  };

  // Include additional details if available
  if (error.details) {
    errorResponse.details = error.details;
  }

  // Return formatted error response
  return NextResponse.json(errorResponse, { status });
}

/**
 * Creates a custom API error with specified details
 */
export class ApiError extends Error {
  status: number;
  details?: any;

  constructor(message: string, status = 500, details?: any) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.details = details;
  }
}