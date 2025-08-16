import { NextRequest, NextResponse } from 'next/server';
import { listMenu, createMenuItem } from '@/server/services/menu.service';

// GET /api/menu - fetch menu items from DB with optional filters (Prisma)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category') || undefined;

    const isAvailableParam = searchParams.get('isAvailable');
    const isAvailable =
      isAvailableParam === null ? undefined : isAvailableParam === 'true';

    const data = await listMenu({ category, isAvailable });

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to fetch menu items' },
      { status: 500 }
    );
  }
}

// POST /api/menu - create a new menu item (Prisma)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const name = String(body?.name ?? '');
    const priceRaw = body?.price;
    const price =
      typeof priceRaw === 'string' ? Number(priceRaw) : Number(priceRaw);
    const category = String(body?.category ?? '');
    const description =
      typeof body?.description === 'string' ? body.description : null;
    const image_url =
      typeof body?.image_url === 'string' ? body.image_url : null;
    const is_available =
      body?.is_available === undefined ? undefined : Boolean(body.is_available);

    if (!name || !Number.isFinite(price) || !category) {
      return NextResponse.json(
        { success: false, error: 'Name, price, and category are required' },
        { status: 400 }
      );
    }

    const created = await createMenuItem({
      name,
      price,
      category,
      description,
      image_url,
      is_available,
    });

    return NextResponse.json({ success: true, data: created }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to create menu item' },
      { status: 500 }
    );
  }
}