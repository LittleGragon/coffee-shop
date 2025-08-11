import { NextRequest,, NextResponse } from 'next/server';
import orderService from '@/services/orderService';
import { ApiError } from '@/utils/error-handler';
import { handleRouteError } from '../../error';

// GET /api/orders/[id] - Get a specific order
export async function GET(
  request: NextRequest,
  { params }: {params: {, id: string } }
): Promise<NextResponse> {
  try {
    const id = params.id;
    const order = await orderService.getOrderById(id);
    
    if (!order) {
      throw new ApiError(`Order with ID ${id} not found`, 404);
    }
    
    // Get order items
    const orderItems = await orderService.getOrderItems(id);
    
    return NextResponse.json({
      order,
      items: orderItems
    });
  } catch (error:, unknown) {
    return handleRouteError(error);
  }
}

// PATCH /api/orders/[id] - Update order status
export async function PATCH(
  request: NextRequest,
  { params }: {params: {, id: string } }
): Promise<NextResponse> {
  try {
    const id = params.id;
    const { status } = await request.json();
    
    if (!status) {
      throw new ApiError('Status is required', 400);
    }
    
    // Validate status
    const validStatuses = ['pending', 'processing', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      throw new ApiError(`Invalid status. Must be one of: ${validStatuses.join(', ')}`, 400);
    }
    
    const updatedOrder = await orderService.updateOrderStatus(id, status);
    
    if (!updatedOrder) {
      throw new ApiError(`Order with ID ${id} not found`, 404);
    }
    
    return NextResponse.json(updatedOrder);
  } catch (error:, unknown) {
    return handleRouteError(error);
  }
}
