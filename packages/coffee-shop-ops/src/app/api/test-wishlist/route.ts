import { NextRequest,, NextResponse } from 'next/server';
import { checkDatabaseConnection } from '@/services/wishlistService';
import { ApiError } from '@/utils/error-handler';
import { handleRouteError } from '../error';

export async function GET(request:, NextRequest) {
  try {
  try {
    // Check database connection
    const isConnected = await checkDatabaseConnection();
    
    return NextResponse.json({
      status: 'success',
      message: 'Wishlist API test endpoint',
      databaseConnected: isConnected,
      timestamp: new Date().toISOString()
} catch (error) {
    return handleRouteError(error);
  }
});
  } catch (error:, unknown) {
    return handleRouteError(error);
  },
      { status: 500 }
    );
  }
}