import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

// GET /api/menu - fetch menu items from DB with optional filters
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category') || undefined;
    const isAvailable = searchParams.get('isAvailable') === 'true';

    const conditions: string[] = [];
    const params: any[] = [];

    if (category) {
      conditions.push(`category = $${params.length + 1}`);
      params.push(category);
    }
    if (isAvailable) {
      conditions.push(`is_available = true`);
    }

    let sql =
      'SELECT id, name, price, category, description, image_url, is_available FROM public.menu_items';
    if (conditions.length > 0) {
      sql += ' WHERE ' + conditions.join(' AND ');
    }
    sql += ' ORDER BY category, name';

    const rows = await query(sql, params);

    return NextResponse.json({ success: true, data: rows });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to fetch menu items' },
      { status: 500 }
    );
  }
}

// POST /api/menu - create a new menu item
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const name = String(body?.name ?? '');
    const price = Number(body?.price);
    const category = String(body?.category ?? '');
    const description =
      typeof body?.description === 'string' ? body.description : null;
    const image_url =
      typeof body?.image_url === 'string' ? body.image_url : null;
    const is_available =
      body?.is_available === undefined ? true : Boolean(body.is_available);

    if (!name || !Number.isFinite(price) || !category) {
      return NextResponse.json(
        { success: false, error: 'Name, price, and category are required' },
        { status: 400 }
      );
    }

    const insertSql = `
      INSERT INTO public.menu_items (name, price, category, description, image_url, is_available)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id, name, price, category, description, image_url, is_available
    `;
    const values = [name, price, category, description, image_url, is_available];

    const rows = await query(insertSql, values);
    const created = rows[0];

    return NextResponse.json({ success: true, data: created }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to create menu item' },
      { status: 500 }
    );
  }
}