import { NextRequest, NextResponse } from 'next/server';

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

// Mock member data for now
const mockMembers = [
  {
    id: '1',
    email: 'john.doe@example.com',
    phone: '123-456-7890',
    name: 'John Doe',
    membership_level: 'Gold',
    balance: 75.50,
    points: 1250,
    created_at: new Date().toISOString()
  }
];

// GET /api/members - Get member by email or phone
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const email = searchParams.get('email');
    const phone = searchParams.get('phone');
    
    if (!email && !phone) {
      return NextResponse.json(
        { error: 'Email or phone parameter is required' },
        { status: 400, headers: corsHeaders }
      );
    }
    
    // Find member by email or phone
    const member = mockMembers.find(m => 
      (email && m.email === email) || (phone && m.phone === phone)
    );
    
    if (!member) {
      return NextResponse.json(
        { error: 'Member not found' },
        { status: 404, headers: corsHeaders }
      );
    }
    
    return NextResponse.json(member, { headers: corsHeaders });
  } catch (error) {
    console.error('Error fetching member:', error);
    return NextResponse.json(
      { error: 'Failed to fetch member' },
      { status: 500, headers: corsHeaders }
    );
  }
}

// POST /api/members - Create a new member
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
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
      id: String(mockMembers.length + 1),
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
  } catch (error) {
    console.error('Error creating member:', error);
    return NextResponse.json(
      { error: 'Failed to create member' },
      { status: 500, headers: corsHeaders }
    );
  }
}