import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');

    const params: any[] = [];
    let sql =
      'SELECT id, name, sku, category, current_stock, minimum_stock, unit, cost_per_unit, supplier, last_restock_date, expiry_date FROM inventory_items';

    if (category) {
      sql += ' WHERE category = $1';
      params.push(category);
    }

    sql += ' ORDER BY category, name';

    const rows = await query(sql, params);
    return NextResponse.json({ success: true, data: rows });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to fetch inventory items' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const name = String(body?.name ?? '');
    const unit = String(body?.unit ?? '');
    const current_stock = Number(body?.quantity ?? body?.current_stock ?? 0);
    const category = body?.category ? String(body.category) : 'Uncategorized';
    const sku = body?.sku ? String(body.sku) : null;
    const minimum_stock = Number(body?.minimum_stock ?? 0);
    const cost_per_unit = body?.cost_per_unit != null ? Number(body.cost_per_unit) : null;
    const supplier = body?.supplier != null ? String(body.supplier) : null;
    const last_restock_date = body?.last_restock_date ?? null;
    const expiry_date = body?.expiry_date ?? null;

    if (!name || !unit) {
      return NextResponse.json(
        { success: false, error: 'Name and unit are required' },
        { status: 400 }
      );
    }

    const insertSql = `
      INSERT INTO inventory_items (name, sku, category, current_stock, minimum_stock, unit, cost_per_unit, supplier, last_restock_date, expiry_date)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING id, name, sku, category, current_stock, minimum_stock, unit, cost_per_unit, supplier, last_restock_date, expiry_date
    `;

    const values = [
      name,
      sku,
      category,
      current_stock,
      minimum_stock,
      unit,
      cost_per_unit,
      supplier,
      last_restock_date,
      expiry_date
    ];

    const rows = await query(insertSql, values);
    const created = rows[0];

    return NextResponse.json({ success: true, data: created }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to create inventory item' },
      { status: 500 }
    );
  }
}