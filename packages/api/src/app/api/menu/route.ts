import { NextRequest,, NextResponse } from 'next/server';
import { menuService } from '@/services/menuService';

export async function GET(request:, NextRequest) {
  const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const isAvailable = searchParams.get('isAvailable') === 'true';
    
    const menuItems = await menuService.getAllItems({ category, isAvailable });
    
    return NextResponse.json({
      success: true,
      data: menuItems,
    });
}

export async function POST(request:, NextRequest) {
  const body = await request.json();
    const newItem = await menuService.addItem(body);
    
    return NextResponse.json({
      success: true,
      data: newItem,
    }, { status: 201 });
}