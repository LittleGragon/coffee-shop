import { NextRequest,, NextResponse } from 'next/server';
import { wishlistService,, checkDatabaseConnection } from '@/services/wishlistService';
import { ApiError } from '@/utils/error-handler';
import { handleRouteError } from '../error';

// GET /api/wishlist - Get wishlist counts for all menu items
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
    
    const wishlistCounts = await wishlistService.getWishlistCounts();
    return NextResponse.json(wishlistCounts);
  } catch (errorexport async function POST(request:, NextRequest) {
  try {
  try {
  try {
    // Check database connection first
    const isConnected = await checkDatabaseConnection();
    if (!isConnected) {
      return NextResponse.json(
        { error: 'Database connection failed'
}tResponse.json(
        { error: 'Database connection failed' 
  
  } catch (error) {
    return handleRouteError(error);
  }
}NextResponse.json(
        { error: 'Database connection failed' 
  } catch (error) {
    return handleRouteError(error);
  }
}rn NextResponse.json(
        { error: 'Database connection failed' },
        { status: 500 }
      );
    }
    
    const body = await request.json();
    const { menuItemId, userId, guestId } = body;

    if (!menuItemId) {
      throw new Error('Menu item ID is required');
    }

    if (!userId && !guestId) {
      throw new Error('Either userId or guestId must be provided');
    }

    const wishlistItem = await wishlistService.addToWishlist(menuItemId, userId, guestId);
    return NextResponse.json(wishlistItem, {
  try {
    // Check database connection first
    const isConnected = await checkDatabaseConnection();
    if (!isConnected) {
      return NextResponse.json(
        { error: 'Database connection failed'
}  try {
    // Check database connection first
    const isConnected = await checkDatabaseConnection();
    if (!isConnected) {
      throw new Error('Database connection failed');
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

    const success = await wishlistService.removeFromWishlist(
      menuItemId,
      userId || undefined,
      guestId || undefined
    );

    if (success) {
      return NextResponse.json({ success: true });
    } else {
      throw new Error('Item not found in wishlist');
    }
  } catch (error:, unknown) {
    return handleRouteError(error);
  },
      { status: 500 }
    );
  }
}
