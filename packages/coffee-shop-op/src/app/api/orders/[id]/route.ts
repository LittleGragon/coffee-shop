import { NextRequest, NextResponse } from 'next/server';
import orderService from '@/services/orderService';

// GET /api/orders/[id] - Get a specific order
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const order = await orderService.getOrderById(id);
    
    if (!order) {
      return NextResponse.json(
        { error: `Order with ID ${id} not found` },
        { status: 404 }
      );
    }
    
    // Get order items
    const orderItems = await orderService.getOrderItems(id);
    
    return NextResponse.json({
      order,
      items: orderItems
    });
  } catch (error) {
    console.error(`Error fetching order ${params.id}:`, error);
    return NextResponse.json(
      { error: 'Failed to fetch order' },
      { status: 500 }
    );
  }
}

// PATCH /api/orders/[id] - Update order status
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const { status } = await request.json();
    
    if (!status) {
      return NextResponse.json(
        { error: 'Status is required' },
        { status: 400 }
      );
    }
    
    // Validate status
    const validStatuses = ['pending', 'processing', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` },
        { status: 400 }
      );
    }
    
    const updatedOrder = await orderService.updateOrderStatus(id, status);
    
    if (!updatedOrder) {
      return NextResponse.json(
        { error: `Order with ID ${id} not found` },
        { status: 404 }
      );
    }
    
    return NextResponse.json(updatedOrder);
  } catch (error) {
    console.error(`Error updating order ${params.id}:`, error);
    return NextResponse.json(
      { error: 'Failed to update order' },
      { status: 500 }
    );
  }
}