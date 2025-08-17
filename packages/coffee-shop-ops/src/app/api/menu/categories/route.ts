import { NextRequest, NextResponse } from 'next/server';
import menuService from '@/services/menuService';
import { handleApiError } from '@/utils/error-handler';

/**
 * GET /api/menu/categories - Get all menu categories
 */
export async function GET(request: NextRequest) {
  try {
    const categories = await menuService.getAllCategories();
    return NextResponse.json(categories);
  } catch (error) {
    return handleApiError(error);
  }
}
