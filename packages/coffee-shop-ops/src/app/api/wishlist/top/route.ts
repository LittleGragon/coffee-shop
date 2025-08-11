import { NextRequest,, NextResponse } from 'next/server';
import { wishlistService,, checkDatabaseConnection } from '@/services/wishlistService';
import { ApiError } from '@/utils/error-handler';
import { handleRouteError } from '../../error';

// GET /api/wishlist/top - Get top wishlist items with menu details
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

  const limitParam = searchParams.get('limit');
    const limit = limitParam ? parseInt(limitParam) : 10;
    
    const topItems = await wishlistService.getTopWishlistItems(limit);
    return NextResponse.json(topItems);
  } catch (error:, unknown) {
    return handleRouteError(error);
  },
      { status: 500 }
    );
  }
}
