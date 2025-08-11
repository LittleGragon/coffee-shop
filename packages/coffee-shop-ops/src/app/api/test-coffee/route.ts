import { NextRequest, NextResponse } from 'next/server';
import { executeQuery } from '@/lib/db';
import { ApiError } from '@/utils/error-handler';
import { handleRouteError } from '../error';

export async function GET(request: NextRequest) {
  try {
    // Get coffee items
    const coffeeItems = await executeQuery(`
      SELECT * FROM menu_items WHERE category = 'Coffee' AND is_available = true
    `);
    
    // If no coffee items, try to find what categories exist
    let categories = [];
    if (coffeeItems.length === 0) {
      categories = await executeQuery(`
        SELECT DISTINCT category FROM menu_items
      `);
    }
    
    return NextResponse.json({ 
      status: 'success',
      coffeeItemsCount: coffeeItems.length,
      coffeeItems,
      categories: categories.map((c: any) => c.category)
    });
  } catch (error: unknown) {
    return handleRouteError(error);
  }, { status: 500 });
  }
}