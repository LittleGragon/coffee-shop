import { NextRequest, NextResponse } from 'next/server';
import categoryService from '@/services/categoryService';
import menuService from '@/services/menuService';
import { ApiError, handleApiError } from '@/utils/error-handler';

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

// Handle preflight requests
export async function OPTIONS(_request: NextRequest) {
  return new NextResponse(null, { status: 200, headers: corsHeaders });
}

// GET /api/categories - List all category names
export async function GET(_request: NextRequest) {
  try {
    const categories = await menuService.getAllCategories();
    return NextResponse.json(categories, { headers: corsHeaders });
  } catch (error) {
    return handleApiError(error);
  }
}

// POST /api/categories - Create a new category
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body?.name || typeof body.name !== 'string') {
      throw new ApiError('Category name is required', 400);
    }

    // Check if category already exists
    const existingCategory = await categoryService.getCategoryByName(body.name);
    if (existingCategory) {
      throw new ApiError('Category already exists', 409);
    }

    const newCategory = await categoryService.createCategory({ name: body.name });
    return NextResponse.json(newCategory, { status: 201, headers: corsHeaders });
  } catch (error) {
    return handleApiError(error);
  }
}

// DELETE /api/categories?name=CategoryName - Delete a category
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const name = searchParams.get('name');

    if (!name) {
      return NextResponse.json(
        { error: 'Category name is required' },
        { status: 400, headers: corsHeaders }
      );
    }

    // Check if category exists
    const category = await categoryService.getCategoryByName(name);
    if (!category) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404, headers: corsHeaders }
      );
    }

    // Prevent deleting a category in use by menu items
    const menuItems = await menuService.getAllItems({ category: name });
    if (menuItems.length > 0) {
      return NextResponse.json(
        {
          error: 'Cannot delete category that is being used by menu items',
          itemCount: menuItems.length,
          items: menuItems.map((item) => ({ id: item.id, name: item.name })),
        },
        { status: 409, headers: corsHeaders }
      );
    }

    // Delete the category
    const success = await categoryService.hardDeleteCategory(category.id);
    if (success) {
      return NextResponse.json(
        { success: true, message: 'Category deleted successfully' },
        { headers: corsHeaders }
      );
    }

    return NextResponse.json(
      { error: 'Failed to delete category' },
      { status: 500, headers: corsHeaders }
    );
  } catch (error) {
    return handleApiError(error);
  }
}