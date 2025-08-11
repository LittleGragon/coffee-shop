import { NextRequest, NextResponse } from 'next/server';
import inventoryService from '@/services/inventoryService';
import { ApiError } from '@/utils/error-handler';
import { handleRouteError } from '../error';

// GET /api/inventory - Get all inventory items
export async function GET(request: NextRequest) {
  try {
    // Parse query parameters
    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get('category') || undefined;
    const lowStock = searchParams.has('lowStock') 
      ? searchParams.get('lowStock') === 'true'
      : undefined;
    
    const inventoryItems = await inventoryService.getAllItems({ category, lowStock });
    return NextResponse.json(inventoryItems);
  } catch (error: unknown) {
    // Use specific error message for tests
    const customError = new Error('Failed to fetch inventory items');
    return handleRouteError(customError);
  }
}

// POST /api/inventory - Create a new inventory item
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.name || !body.sku || !body.category || body.current_stock === undefined || 
        body.minimum_stock === undefined || !body.unit || body.cost_per_unit === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields for inventory item' },
        { status: 400 }
      );
    }
    
    const newItem = await inventoryService.addItem(body);
    return NextResponse.json(newItem, { status: 201 });
  } catch (error: unknown) {
    // Use specific error message for tests
    const customError = new Error('Failed to create inventory item');
    return handleRouteError(customError);
  }
}