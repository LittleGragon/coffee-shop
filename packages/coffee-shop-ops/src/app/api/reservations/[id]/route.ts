import { NextRequest, NextResponse } from 'next/server';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function OPTIONS(_req: NextRequest) {
  return new NextResponse(null, { status: 200, headers: corsHeaders });
}

export async function GET(_req: NextRequest, _ctx?: { params?: Record<string, string> }) {
  return NextResponse.json({ error: 'Not implemented' }, { status: 501, headers: corsHeaders });
}

export async function POST(_req: NextRequest, _ctx?: { params?: Record<string, string> }) {
  return NextResponse.json({ error: 'Not implemented' }, { status: 501, headers: corsHeaders });
}

export async function PUT(_req: NextRequest, _ctx?: { params?: Record<string, string> }) {
  return NextResponse.json({ error: 'Not implemented' }, { status: 501, headers: corsHeaders });
}

export async function DELETE(_req: NextRequest, _ctx?: { params?: Record<string, string> }) {
  return NextResponse.json({ error: 'Not implemented' }, { status: 501, headers: corsHeaders });
}
