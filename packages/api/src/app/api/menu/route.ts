import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import menuService from 'coffee-shop-ops/services/menuService';
import { MenuItem } from '@/types/models';
import { ApiError } from '@/utils/error-handler';

// GET /api/menu - Get all menu items with optional filters
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category') || undefined;
  const isAvailableStr = searchParams.get('available');
  // Convert string to boolean or keep as undefined
  const isAvailable = isAvailableStr === null ? undefined : isAvailableStr === 'true';

  try {
    const menuItems = await menuService.getAllItems({ category, isAvailable });
    return NextResponse.json(menuItems);
  } catch (error) {
    // Use specific error message for tests
    return NextResponse.json({ error: 'Failed to fetch menu items' }, { status: 500 });
  }
}

// POST /api/menu - Create a new menu item
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, price, category, description, image_url, is_available } = body as Partial<MenuItem>;

    if (!name || price === undefined || !category) {
      return NextResponse.json({ error: 'Name, price, and category are required' }, { status: 400 });
    }

    try {
      const newItem = await menuService.addItem({
        name,
        price,
        category,
        description,
        image_url,
        is_available,
      });

      return NextResponse.json(newItem, { status: 201 });
    } catch (error) {
      // Use specific error message for tests
      return NextResponse.json({ error: 'Failed to create menu item' }, { status: 500 });
    }
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request format' }, { status: 400 });
  }
}
