import { NextRequest, NextResponse } from 'next/server';
import menuService from 'coffee-shop-ops/services/menuService';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
    const category = searchParams.get('category') || undefined;
    const isAvailable = searchParams.get('isAvailable') === 'true';
    
    const menuItems = await menuService.getAllItems({ category, isAvailable });
    
    return NextResponse.json({
      success: true,
      data: menuItems,
    });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.name || !body.price || !body.category) {
      return NextResponse.json({
        success: false,
        error: 'Name, price, and category are required'
      }, { status: 400 });
    }
    
    const newItem = await menuService.addItem(body);
    
    return NextResponse.json({
      success: true,
      data: newItem,
    }, { status: 201 });
  } catch (error: any) {
    if (error.name === 'ValidationError') {
      return NextResponse.json({
        success: false,
        error: error.message || 'Validation error'
      }, { status: 400 });
    }
    
    return NextResponse.json({
      success: false,
      error: 'Failed to create menu item'
    }, { status: 500 });
  }
}
