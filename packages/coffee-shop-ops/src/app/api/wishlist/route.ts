import { NextRequest, NextResponse } from 'next/server';
import { wishlistService, checkDatabaseConnection } from '@/services/wishlistService';

// GET /api/wishlist - Get wishlist counts for all menu items
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
    
    const wishlistCounts = await wishlistService.getWishlistCounts();
    return NextResponse.json(wishlistCounts);
  } catch (error) {
    console.error('Error fetching wishlist counts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch wishlist counts', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

// POST /api/wishlist - Add an item to wishlist
export async function POST(request: NextRequest) {
  try {
    // Check database connection first
    const isConnected = await checkDatabaseConnection();
    if (!isConnected) {
      return NextResponse.json(
        { error: 'Database connection failed' },
        { status: 500 }
      );
    }
    
    const body = await request.json();
    const { menuItemId, userId, guestId } = body;

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

    const wishlistItem = await wishlistService.addToWishlist(menuItemId, userId, guestId);
    return NextResponse.json(wishlistItem, { status: 201 });
  } catch (error) {
    console.error('Error adding to wishlist:', error);
    return NextResponse.json(
      { error: 'Failed to add item to wishlist', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

// DELETE /api/wishlist - Remove an item from wishlist
export async function DELETE(request: NextRequest) {
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

    const success = await wishlistService.removeFromWishlist(
      menuItemId,
      userId || undefined,
      guestId || undefined
    );

    if (success) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json(
        { error: 'Item not found in wishlist' },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error('Error removing from wishlist:', error);
    return NextResponse.json(
      { error: 'Failed to remove item from wishlist', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
