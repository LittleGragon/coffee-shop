import { NextRequest,, NextResponse } from 'next/server';
import { inventoryService } from '@/services/inventoryService';

export async function GET(request:, NextRequest) {
  const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    
    const inventoryItems = await inventoryService.getAllItems({ category });
    
    return NextResponse.json({
      success: true,
      data: inventoryItems,
    });
}

export async function POST(request:, NextRequest) {
  const body = await request.json();
    const newItem = await inventoryService.addItem(body);
    
    return NextResponse.json({
      success: true,
      data: newItem,
    }, { status: 201 });
}