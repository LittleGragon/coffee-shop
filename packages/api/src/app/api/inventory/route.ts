import { NextRequest, NextResponse } from 'next/server';
import { executeQuery } from '@/lib/db';
import { InventoryItem } from '@/types/models';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const lowStock = searchParams.get('lowStock');

    let query = 'SELECT * FROM inventory_items';
    const params: any[] = [];
    const conditions: string[] = [];

    if (category) {
      conditions.push('category = $1');
      params.push(category);
    }

    if (lowStock === 'true') {
      const paramIndex = params.length + 1;
      conditions.push(`current_stock <= minimum_stock`);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    query += ' ORDER BY category, name';

    const inventoryItems = await executeQuery<InventoryItem>(query, params);
    return NextResponse.json(inventoryItems);
  } catch (error) {
    console.error('Error fetching inventory items:', error);
    return NextResponse.json(
      { error: 'Failed to fetch inventory items' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.name || !body.sku || !body.category || !body.unit) {
      return NextResponse.json(
        { error: 'Name, SKU, category, and unit are required' },
        { status: 400 }
      );
    }
    
    const { name, sku, category, current_stock, minimum_stock, cost_per_unit, unit, supplier, description } = body;
    
    const items = await executeQuery<InventoryItem>(
      `INSERT INTO inventory_items (name, sku, category, current_stock, minimum_stock, cost_per_unit, unit, supplier, description) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
      [name, sku, category, current_stock || 0, minimum_stock || 0, cost_per_unit || 0, unit, supplier || null, description || null]
    );
    
    return NextResponse.json(items[0], { status: 201 });
  } catch (error) {
    console.error('Error creating inventory item:', error);
    return NextResponse.json(
      { error: 'Failed to create inventory item' },
      { status: 500 }
    );
  }
}