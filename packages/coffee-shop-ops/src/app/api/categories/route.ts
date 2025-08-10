import { NextRequest, NextResponse } from 'next/server';
import categoryService from '@/services/categoryService';
import menuService from '@/services/menuService';

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

// Handle preflight requests
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, { status: 200, headers: corsHeaders });
}

// GET /api/categories - Get all categories
export async function GET(request: NextRequest) {
  try {
    const categories = await categoryService.getCategoryNames();
    return NextResponse.json(categories, { headers: corsHeaders });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500, headers: corsHeaders }
    );
  }
}

// POST /api/categories - Create a new category
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.name) {
      return NextResponse.json(
        { error: 'Category name is required' },
        { status: 400, headers: corsHeaders }
      );
    }
    
    // Check if category already exists
    const existingCategory = await categoryService.getCategoryByName(body.name);
    if (existingCategory) {
      return NextResponse.json(
        { error: 'Category already exists' },
        { status: 409, headers: corsHeaders }
      );
    }
    
    const newCategory = await categoryService.createCategory({
      name: body.name,
      description: body.description
    });
    
    return NextResponse.json(newCategory, { status: 201, headers: corsHeaders });
  } catch (error) {
    console.error('Error creating category:', error);
    return NextResponse.json(
      { error: 'Failed to create category' },
      { status: 500, headers: corsHeaders }
    );
  }
}

// DELETE /api/categories - Delete a category
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
    
    // Check if any menu items are using this category
    const menuItems = await menuService.getAllItems({ category: name });
    if (menuItems.length > 0) {
      return NextResponse.json(
        { 
          error: 'Cannot delete category that is being used by menu items',
          itemCount: menuItems.length,
          items: menuItems.map(item => ({ id: item.id, name: item.name }))
        },
        { status: 409, headers: corsHeaders }
      );
    }
    
    // Delete the category
    const success = await categoryService.hardDeleteCategory(category.id);
    
    if (success) {
      return NextResponse.json({ success: true, message: 'Category deleted successfully' }, { headers: corsHeaders });
    } else {
      return NextResponse.json(
        { error: 'Failed to delete category' },
        { status: 500, headers: corsHeaders }
      );
    }
  } catch (error) {
    console.error('Error deleting category:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to delete category' },
      { status: 500, headers: corsHeaders }
    );
  }
}
