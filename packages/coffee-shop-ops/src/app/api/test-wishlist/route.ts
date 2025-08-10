import { NextRequest, NextResponse } from 'next/server';
import { checkDatabaseConnection } from '@/services/wishlistService';

export async function GET(request: NextRequest) {
  try {
    // Check database connection
    const isConnected = await checkDatabaseConnection();
    
    return NextResponse.json({
      status: 'success',
      message: 'Wishlist API test endpoint',
      databaseConnected: isConnected,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error in test-wishlist endpoint:', error);
    return NextResponse.json(
      { error: 'Test endpoint failed', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}