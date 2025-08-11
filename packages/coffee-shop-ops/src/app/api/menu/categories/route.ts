import { NextRequest, NextResponse } from 'next/server';
import menuService from '@/services/menuService';
import { ApiError } from '@/utils/error-handler';
import { handleRouteError } from '../../error';

// GET /api/menu/categories - Get all menu categories
export async function GET(request: NextRequest) {
  try {
    const categories = await menuService.getAllCategories();
    return NextResponse.json(categories);
  } catch (error: unknown) {
    return handleRouteError(error);
  }
}