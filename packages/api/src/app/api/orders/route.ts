import { NextRequest, NextResponse } from 'next/server';
import { executeQuery } from '@/lib/db';
import { Order, OrderItem } from '@/types/models';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const orderType = searchParams.get('orderType');

    let query = `
      SELECT o.*, 
             json_agg(
               json_build_object(
                 'id', oi.id,
                 'menu_item_id', oi.menu_item_id,
                 'menu_item_name', oi.menu_item_name,
                 'quantity', oi.quantity,
                 'unit_price', oi.unit_price,
                 'subtotal', oi.subtotal,
                 'customizations', oi.customizations
               )
             ) as items
      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.order_id
    `;
    
    const params: any[] = [];
    const conditions: string[] = [];

    if (status) {
      conditions.push('o.status = $1');
      params.push(status);
    }

    if (orderType) {
      const paramIndex = params.length + 1;
      conditions.push(`o.order_type = $${paramIndex}`);
      params.push(orderType);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    query += ' GROUP BY o.id ORDER BY o.created_at DESC';

    const orders = await executeQuery<Order>(query, params);
    return NextResponse.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.items || !Array.isArray(body.items) || body.items.length === 0) {
      return NextResponse.json(
        { error: 'Order must contain at least one item' },
        { status: 400 }
      );
    }
    
    const { customer_name, customer_email, customer_phone, items, order_type, notes } = body;
    
    // Calculate total amount
    const total_amount = items.reduce((sum: number, item: any) => sum + (item.unit_price * item.quantity), 0);
    
    // Create the order
    const orders = await executeQuery<Order>(
      `INSERT INTO orders (customer_name, customer_email, customer_phone, total_amount, status, order_type, notes) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [customer_name || null, customer_email || null, customer_phone || null, total_amount, 'pending', order_type || 'dine-in', notes || null]
    );
    
    const order = orders[0];
    
    // Create order items
    const orderItems = [];
    for (const item of items) {
      const orderItemResult = await executeQuery<OrderItem>(
        `INSERT INTO order_items (order_id, menu_item_id, menu_item_name, quantity, unit_price, subtotal, customizations) 
         VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
        [order.id, item.menu_item_id, item.menu_item_name, item.quantity, item.unit_price, item.unit_price * item.quantity, item.customizations || null]
      );
      orderItems.push(orderItemResult[0]);
    }
    
    return NextResponse.json({ ...order, items: orderItems }, { status: 201 });
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    );
  }
}