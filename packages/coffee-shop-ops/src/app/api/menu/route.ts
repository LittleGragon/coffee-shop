import { NextRequest, NextResponse } from 'next/server';
import menuService from '@/services/menuService';

// GET /api/menu - Get all menu items
export async function GET(request: NextRequest) {
  try {
    // Parse query parameters
    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get('category') || undefined;
    const isAvailable = searchParams.has('available') 
      ? searchParams.get('available') === 'true'
      : undefined;
    
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
    
    // Validate required fields
    if (!body.name || !body.price || !body.category) {
      return NextResponse.json(
        { error: 'Name, price, and category are required' },
        { status: 400 }
      );
    }
    
    const newItem = await menuService.addItem(body);
    return NextResponse.json(newItem, { status: 201 });
  } catch (error) {
    // console.error('Error creating menu item:', error);
    return NextResponse.json(
      { error: 'Failed to create menu item' },
      { status: 500 }
    );
  }
}