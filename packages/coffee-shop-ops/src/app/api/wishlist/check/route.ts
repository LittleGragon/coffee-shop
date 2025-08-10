import { NextRequest, NextResponse } from 'next/server';
import { wishlistService, checkDatabaseConnection } from '@/services/wishlistService';

// GET /api/wishlist/check - Check if an item is in a user's wishlist
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
    const menuItemId = searchParams.get('menuItemId');
    const userId = searchParams.get('userId');
    const guestId = searchParams.get('guestId');

    if (!menuItemId) {
      return NextResponse.json(
        { error: 'Menu item ID is required' },
        { status: 400 }
      );
    }

    if (!userId && !guestId) {
      return NextResponse.json(
        { error: 'Either userId or guestId must be provided' },
        { status: 400 }
      );
    }

    const isInWishlist = await wishlistService.isInWishlist(
      menuItemId,
      userId || undefined,
      guestId || undefined
    );

    return NextResponse.json({ isInWishlist });
  } catch (error) {
    console.error('Error checking wishlist status:', error);
    return NextResponse.json(
      { error: 'Failed to check wishlist status', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
