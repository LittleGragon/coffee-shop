import { NextRequest, NextResponse } from 'next/server';
import inventoryService from 'coffee-shop-ops/services/inventoryService';
import { ApiError } from '@/utils/error-handler';
import { handleRouteError } from "../error";
import { handleRouteError } from "../error";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category') || undefined;
    const lowStock = searchParams.get('lowStock') === 'true';

    const inventoryItems = await inventoryService.getAllItems({ category, lowStock });
    return NextResponse.json(inventoryItems);
  } catch (error) {
    return handleRouteError(error);
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
    return handleRouteError(error);
  }
}