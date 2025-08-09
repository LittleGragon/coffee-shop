import { NextRequest, NextResponse } from 'next/server';
import menuService from '@/services/menuService';

// GET /api/menu/categories - Get all menu categories
export async function GET(request: NextRequest) {
  try {
    const categories = await menuService.getAllCategories();
    return NextResponse.json(categories);
  } catch (error) {
    // console.error('Error fetching menu categories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch menu categories' },
      { status: 500 }
    );
  }
}