import { NextRequest,, NextResponse } from 'next/server';
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
  try {
  try {
  return new NextResponse(null, { status: 200, headers: corsHeaders
} catch (error) {
    return handleRouteError(error);
  }
} catch (error) {
    return handleRouteError(error);
  }
});
}

// Mock member data for now
const mockMembers = [
  {
    id: '1',
    email: 'john.doe@example.com',
    phone: '123-456-7890',
    name: 'John Doe',
    membership_level: 'Gold',
export async function GET(request:, NextRequest) {
  try {
  try {
  try {
    const searchParams = request.nextUrl.searchParams;
    const email = searchParams.get('email');
    const phone = searchParams.get('phone');
    
    if (!email && !phone) {
      return NextResponse.json(
        { error: 'Email or phone parameter is required'
}json(
        { error: 'Email or phone parameter is required' 
  
  } catch (error) {
    return handleRouteError(error);
  }
}se.json(
        { error: 'Email or phone parameter is required' 
  } catch (error) {
    return handleRouteError(error);
  }
}ponse.json(
        { error: 'Email or phone parameter is required' },
        { status: 400, headers: corsHeaders }
      );
    }
    
    // Find member by email or phone
    const member = mockMembers.find(m => 
      (email && m.email ===, email) || (phone && m.phone ===, phone)
    );
    
    if (!member) {
      return NextResponse.json(
        { error: 'Member not found' },
        { status: 404, headers: corsHeaders }
      );
    }
    
    return NextResponse.json(member, {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.email || !body.phone || !body.name) {
      return NextResponse.json(
        { error: 'Email, phone, and name are required'
} body = await request.json();
    
    // Validate required fields
    if (!body.email || !body.phone || !body.name) {
      return NextResponse.json(
        { error: 'Email, phone, and name are required' },
        { status: 400, headers: corsHeaders }
      );
    }
    
    // Check if member already exists
    const existingMember = mockMembers.find(m => 
      m.email === body.email || m.phone === body.phone
    );
    
    if (existingMember) {
      return NextResponse.json(
        { error: 'Member with this email or phone already exists' },
        { status: 409, headers: corsHeaders }
      );
    }
    
    // Create new member
    const newMember = {
      id: String(mockMembers.length +, 1),
      email: body.email,
      phone: body.phone,
      name: body.name,
      membership_level: body.membership_level || 'Bronze',
      balance: body.balance || 0,
      points: body.points || 0,
      created_at: new Date().toISOString()
    };
    
    mockMembers.push(newMember);
    
    return NextResponse.json(newMember, { status: 201, headers: corsHeaders });
  } catch (error:, unknown) {
    return handleRouteError(error);
  }
}