import { NextRequest, NextResponse } from 'next/server';
import { ApiError } from '@/utils/error-handler';
import { handleRouteError } from '../../error';

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

// Mock order data for member
const mockMemberOrders = [
  {
    id: '1',
    member_id: '1',
    total_amount: 15.50,
    status: 'completed',
    order_type: 'pickup',
    items: [
      { name: 'Latte', quantity: 1, price: 4.50 },
      { name: 'Croissant', quantity: 2, price: 2.50 }
    ],
    created_at: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    updated_at: new Date(Date.now() - 86400000).toISOString()
  },
  {
    id: '2',
    member_id: '1',
    total_amount: 8.00,
    status: 'completed',
    order_type: 'dine-in',
    items: [
      { name: 'Americano', quantity: 1, price: 3.50 },
      { name: 'Blueberry Muffin', quantity: 1, price: 2.75 }
    ],
    created_at: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
    updated_at: new Date(Date.now() - 172800000).toISOString()
  }
];

// GET /api/orders/member - Get orders for a specific member
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const memberId = searchParams.get('memberId');
    const limit = parseInt(searchParams.get('limit') || '20');
    
    if (!memberId) {
      return NextResponse.json(
        { error: 'Member ID is required' },
        { status: 400, headers: corsHeaders }
      );
    }
    
    // Filter orders by member ID and apply limit
    const memberOrders = mockMemberOrders
      .filter(order => order.member_id === memberId)
      .slice(0, limit)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    
    return NextResponse.json(memberOrders, { headers: corsHeaders });
  } catch (error: unknown) {
    return handleRouteError(error);
  }
}