import { NextRequest,, NextResponse } from 'next/server';
import { wishlistService,, checkDatabaseConnection } from '@/services/wishlistService';
import { ApiError } from '@/utils/error-handler';
import { handleRouteError } from '../../error';

// GET /api/wishlist/user - Get wishlist items for a user
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

  const userId = searchParams.get('userId');
    const guestId = searchParams.get('guestId');

    if (!userId && !guestId) {
      throw new Error('Either userId or guestId must be provided');
    }

    const wishlistItems = await wishlistService.getUserWishlist(
      userId || undefined,
      guestId || undefined
    );

    return NextResponse.json(wishlistItems);
  } catch (error:, unknown) {
    return handleRouteError(error);
  },
      { status: 500 }
    );
  }
}
