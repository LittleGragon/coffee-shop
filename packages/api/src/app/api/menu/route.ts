import { NextRequest, NextResponse } from 'next/server';
import menuService from 'coffee-shop-ops/services/menuService';
import { MenuItem } from '@/types/models';

// GET /api/menu - Get all menu items with optional filters
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category') || undefined;
  const isAvailableStr = searchParams.get('available');
  const isAvailable = isAvailableStr ? isAvailableStr === 'true' : undefined;

  try {
    const menuItems = await menuService.getAllItems({ category, isAvailable });
    return NextResponse.json(menuItems);
  } catch (error) {
    // console.error('Error fetching menu items:', error);
    return NextResponse.json(
      { error: 'Failed to fetch menu items' },
      { status: 500 }
    );
  }
}

// POST /api/menu - Create a new menu item
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, price, category, description, image_url, is_available } = body as Partial<MenuItem>;

    if (!name || price === undefined || !category) {
      return NextResponse.json(
        { error: 'Name, price, and category are required' },
        { status: 400 }
      );
    }

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
    // console.error('Error creating menu item:', error);
    return NextResponse.json(
      { error: 'Failed to create menu item' },
      { status: 500 }
    );
  }
}