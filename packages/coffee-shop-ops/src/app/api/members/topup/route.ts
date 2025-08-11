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

// POST /api/members/topup - Top up member balance
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.memberId || !body.amount) {
      return NextResponse.json(
        { error: 'Member ID and amount are required' },
        { status: 400, headers: corsHeaders }
      );
    }
    
    if (body.amount <= 0) {
      return NextResponse.json(
        { error: 'Amount must be greater than 0' },
        { status: 400, headers: corsHeaders }
      );
    }
    
    // Mock response for now
    const updatedMember = {
      id: body.memberId,
      email: 'john.doe@example.com',
      phone: '123-456-7890',
      name: 'John Doe',
      membership_level: 'Gold',
      balance: 75.50 + body.amount,
      points: 1250 + Math.floor(body.amount * 10), // 10 points per dollar
      created_at: new Date().toISOString()
    };
    
    return NextResponse.json({
      success: true,
      member: updatedMember,
      message: `Successfully topped up $${body.amount}`
    }, { headers: corsHeaders });
  } catch (error: unknown) {
    return handleRouteError(error);
  }
}