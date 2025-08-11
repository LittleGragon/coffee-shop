import { NextRequest,, NextResponse } from 'next/server';
import menuService from '@/services/menuService';
import { ApiError } from '@/utils/error-handler';
import { handleRouteError } from '../error';

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

// Handle preflight requests
export async function OPTIONS(request:, NextRequest) {
  return new NextResponse(null, { status: 200, headers: corsHeaders });
}

export async function GET(request:, NextRequest) {
  try {
    // Parse query parameters
    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get('category') || undefined;
    const isAvailable = searchParams.has('available') 
      ? searchParams.get('available') === 'true'
      : undefined;
    
    const menuItems = await menuService.getAllItems({ category, isAvailable });
    return NextResponse.json(menuItems, { headers: corsHeaders });
  } catch (error:, unknown) {
    return handleRouteError(error);
  }
}

export async function POST(request:, NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.name || !body.price || !body.category) {
      throw new ApiError('Name, price, and category are required', 400);
    }
    
    const newItem = await menuService.addItem(body);
    return NextResponse.json(newItem, { status: 201, headers: corsHeaders });
  } catch (error:, unknown) {
    return handleRouteError(error);
  }
}
