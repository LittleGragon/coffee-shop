import { NextRequest, NextResponse } from 'next/server';
import orderService from '@/services/orderService';

// GET /api/orders - Get all orders
export async function GET(request: NextRequest) {
  try {
    // Parse query parameters
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status') || undefined;
    const userId = searchParams.get('userId') || undefined;
    
    const orders = await orderService.getAllOrders({ status, userId });
    return NextResponse.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}

// POST /api/orders - Create a new order
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.orderData || !body.orderItems || !Array.isArray(body.orderItems) || body.orderItems.length === 0) {
      return NextResponse.json(
        { error: 'Order data and at least one order item are required' },
        { status: 400 }
      );
    }
    
    // Validate order data
    if (body.orderData.total_amount === undefined) {
      return NextResponse.json(
        { error: 'Total amount is required' },
        { status: 400 }
      );
    }
    
    // Validate order items
    for (const item of body.orderItems) {
      if (!item.menu_item_id || item.quantity === undefined || item.price_at_time === undefined) {
        return NextResponse.json(
          { error: 'Each order item must have menu_item_id, quantity, and price_at_time' },
          { status: 400 }
        );
      }
    }
    
    const newOrder = await orderService.createOrder(body.orderData, body.orderItems);
    return NextResponse.json(newOrder, { status: 201 });
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    );
  }
}