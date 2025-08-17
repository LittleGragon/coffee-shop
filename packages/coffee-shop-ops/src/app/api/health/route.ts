import { NextRequest, NextResponse } from 'next/server';

export async function GET(_req: NextRequest) {
  return NextResponse.json({ ok: true, service: 'coffee-shop-ops' }, { status: 200 });
}

export async function OPTIONS(_req: NextRequest) {
  return new NextResponse(null, { status: 200 });
}