# API Error Handling

This document describes the error handling approach used in the Coffee Shop Ops package.

## Error Handling Flow

1. **Error Source**: Errors are thrown at the source (database layer, validation, services)
2. **Error Catching**: Errors are caught at the API route level using try/catch blocks
3. **Error Formatting**: Errors are formatted consistently using `handleRouteError`
4. **Error Response**: Formatted errors are returned as HTTP responses

## Error Types

### ApiError

The `ApiError` class is used for custom API errors with specific status codes and details:

```typescript
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
```

### Database Errors

Database errors are caught and re-thrown in the database layer:

```typescript
try {
  // Database operations
} catch (error) {
  console.error('Database query error:', error);
  throw error;  // Error is properly thrown
}
```

## Error Handling in API Routes

API routes use try/catch blocks to catch errors and format them using `handleRouteError`:

```typescript
export async function GET(request: NextRequest) {
  try {
    // API logic
    return NextResponse.json(result);
  } catch (error) {
    return handleRouteError(error);
  }
}
```

## Best Practices

1. **Always throw errors**: Don't return errors, throw them
2. **Use ApiError for custom errors**: Use the ApiError class for custom errors with specific status codes
3. **Catch errors at the API route level**: Use try/catch blocks in API routes
4. **Format errors consistently**: Use handleRouteError to format errors consistently
5. **Log errors**: Log errors for debugging purposes