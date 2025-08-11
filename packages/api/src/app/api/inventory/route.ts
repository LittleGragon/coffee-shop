import { NextRequest, NextResponse } from 'next/server';
import inventoryService from 'coffee-shop-ops/services/inventoryService';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category') || undefined;
  
  const inventoryItems = await inventoryService.getAllItems({ category });
  
  return NextResponse.json({
    success: true,
    data: inventoryItems,
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.name || !body.quantity || !body.unit) {
      return NextResponse.json({
        success: false,
        error: 'Name, quantity, and unit are required'
      }, { status: 400 });
    }
    
    const newItem = await inventoryService.addItem(body);
    
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
      error: 'Failed to create inventory item'
    }, { status: 500 });
  }
}
