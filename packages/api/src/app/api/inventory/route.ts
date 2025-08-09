import { NextRequest, NextResponse } from 'next/server';
import inventoryService from 'coffee-shop-ops/services/inventoryService';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category') || undefined;
    const lowStock = searchParams.get('lowStock') === 'true';

    const inventoryItems = await inventoryService.getAllItems({ category, lowStock });
    return NextResponse.json(inventoryItems);
  } catch (error) {
    // console.error('Error fetching inventory items:', error);
    return NextResponse.json(
      { error: 'Failed to fetch inventory items' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.name || !body.sku || !body.category || !body.unit) {
      return NextResponse.json(
        { error: 'Name, SKU, category, and unit are required' },
        { status: 400 }
      );
    }
    
    const newItem = await inventoryService.addItem(body);
    
    return NextResponse.json(newItem, { status: 201 });
  } catch (error) {
    // console.error('Error creating inventory item:', error);
    return NextResponse.json(
      { error: 'Failed to create inventory item' },
      { status: 500 }
    );
  }
}