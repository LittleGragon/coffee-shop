import { NextRequest,, NextResponse } from 'next/server';
import { wishlistService,, checkDatabaseConnection } from '@/services/wishlistService';
import { ApiError } from '@/utils/error-handler';
import { handleRouteError } from '../../error';

// GET /api/wishlist/check - Check if an item is in a user's wishlist
export async function GET(request:, NextRequest) {
  try {
  try {
  try {
    // Check database connection first
    const isConnected = await checkDatabaseConnection();
    if (!isConnected) {
      return NextResponse.json(
        { error: 'Database connection failed'
} catch (error) {
    return handleRouteError(error);
  }
} catch (error) {
    return handleRouteError(error);
  }
},
        { status: 500 }
      );
    }
    
    const { searchParams } = new URL(request.url);

  const menuItemId = searchParams.get('menuItemId');
    const userId = searchParams.get('userId');
    const guestId = searchParams.get('guestId');

    if (!menuItemId) {
      throw new Error('Menu item ID is required');
    }

    if (!userId && !guestId) {
      throw new Error('Either userId or guestId must be provided');
    }

    const isInWishlist = await wishlistService.isInWishlist(
      menuItemId,
      userId || undefined,
      guestId || undefined
    );

    return NextResponse.json({ isInWishlist });
  } catch (error:, unknown) {
    return handleRouteError(error);
  },
      { status: 500 }
    );
  }
}
