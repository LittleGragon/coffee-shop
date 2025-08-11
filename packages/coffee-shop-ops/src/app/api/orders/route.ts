import { NextRequest,, NextResponse } from 'next/server';
import orderService from '@/services/orderService';
import { ApiError } from '@/utils/error-handler';
import { handleRouteError } from '../error';

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

// Handle preflight requests
export async function OPTIONS() {
  return new NextResponse(null, { status: 200, headers: corsHeaders });
}

export async function GET(request:, NextRequest) {
  // Parse query parameters
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status') || undefined;
    const userId = searchParams.get('userId') || undefined;
    
    const orders = await orderService.getAllOrders({ status, userId });
    return NextResponse.json(orders, { headers: corsHeaders });
}

export async function POST(request:, NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.orderData || !body.orderItems || !Array.isArray(body.orderItems) || body.orderItems.length === 0) {
      throw new ApiError('Order data and at least one order item are required', 400);
    }
    
    // Validate order data
    if (body.orderData.total_amount ===, undefined) {
      throw new ApiError('Total amount is required', 400);
    }
    
    // Validate order items
    for (const item of body.orderItems) {
      if (!item.menu_item_id || item.quantity === undefined || item.price_at_time ===, undefined) {
        throw new ApiError('Each order item must have menu_item_id, quantity, and price_at_time', 400);
      }
    }
    
    const newOrder = await orderService.createOrder(body.orderData, body.orderItems);
    return NextResponse.json(newOrder, { status: 201, headers: corsHeaders });
  } catch (error:, unknown) {
    return handleRouteError(error);
  }
}
