import { NextRequest, NextResponse } from 'next/server';
import categoryService from '@/services/categoryService';

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