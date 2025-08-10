import { NextRequest, NextResponse } from 'next/server';
import { wishlistService, checkDatabaseConnection } from '@/services/wishlistService';

// GET /api/wishlist/user - Get wishlist items for a user
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
    const userId = searchParams.get('userId');
    const guestId = searchParams.get('guestId');

    if (!userId && !guestId) {
      return NextResponse.json(
        { error: 'Either userId or guestId must be provided' },
        { status: 400 }
      );
    }

    const wishlistItems = await wishlistService.getUserWishlist(
      userId || undefined,
      guestId || undefined
    );

    return NextResponse.json(wishlistItems);
  } catch (error) {
    console.error('Error fetching user wishlist:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user wishlist', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
