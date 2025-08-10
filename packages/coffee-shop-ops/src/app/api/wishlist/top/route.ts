import { NextRequest, NextResponse } from 'next/server';
import { wishlistService, checkDatabaseConnection } from '@/services/wishlistService';

// GET /api/wishlist/top - Get top wishlist items with menu details
export async function GET(request: NextRequest) {
  try {
    // Check database connection first
    const isConnected = await checkDatabaseConnection();
    if (!isConnected) {
      return NextResponse.json(
        { error: 'Database connection failed' },
        { status: 500 }
      );
    }
    
    const { searchParams } = new URL(request.url);
    const limitParam = searchParams.get('limit');
    const limit = limitParam ? parseInt(limitParam) : 10;
    
    const topItems = await wishlistService.getTopWishlistItems(limit);
    return NextResponse.json(topItems);
  } catch (error) {
    console.error('Error fetching top wishlist items:', error);
    return NextResponse.json(
      { error: 'Failed to fetch top wishlist items', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
