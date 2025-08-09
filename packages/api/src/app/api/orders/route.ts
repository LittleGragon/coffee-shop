import { NextRequest, NextResponse } from 'next/server';
import { query } from '../../../lib/db';
import { Order, OrderItem } from '../../../types/models';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const memberId = searchParams.get('memberId');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    let queryText = `
      SELECT o.*, 
             json_agg(
               json_build_object(
                 'id', oi.id,
                 'menu_item_id', oi.menu_item_id,
                 'menu_item_name', oi.menu_item_name,
                 'quantity', oi.quantity,
                 'unit_price', oi.price_at_time,
                 'subtotal', oi.subtotal
               )
             ) as items
      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.order_id
    `;
    
    const params: any[] = [];
    if (memberId) {
      queryText += ' WHERE o.member_id = $1';
      params.push(memberId);
    }
    
    queryText += `
      GROUP BY o.id
      ORDER BY o.created_at DESC
      LIMIT $${params.length + 1} OFFSET $${params.length + 2}
    `;
    params.push(limit, offset);

    const result = await query(queryText, params);
    
    const orders = result.rows.map(order => ({
      id: order.id,
      customer_name: order.customer_name,
      customer_email: order.customer_email,
      customer_phone: order.customer_phone,
      member_id: order.member_id,
      items: order.items || [],
      total_amount: parseFloat(order.total_amount),
      status: order.status,
      order_type: order.order_type,
      notes: order.notes,
      points_earned: order.points_earned,
      points_used: order.points_used,
      created_at: order.created_at,
      updated_at: order.updated_at
    }));

    return NextResponse.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      customer_name,
      customer_email,
      customer_phone,
      member_id,
      items,
      order_type = 'takeout',
      notes,
      payment_method = 'wechat_pay'
    } = body;

    if (!customer_name || !items || items.length === 0) {
      return NextResponse.json({ 
        error: 'Customer name and items are required' 
      }, { status: 400 });
    }

    // Calculate total amount
    const total_amount = items.reduce((sum: number, item: any) => 
      sum + (item.price * item.quantity), 0
    );

    // Calculate points earned (1 point per dollar spent)
    const points_earned = Math.floor(total_amount);

    // Start transaction
    await query('BEGIN');

    try {
      // Create order
      const orderResult = await query(
        `INSERT INTO orders (
          customer_name, customer_email, customer_phone, member_id,
          total_amount, status, order_type, notes, points_earned
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
        [
          customer_name, customer_email, customer_phone, member_id,
          total_amount, 'pending', order_type, notes, points_earned
        ]
      );

      const order = orderResult.rows[0];

      // Create order items
      for (const item of items) {
        await query(
          `INSERT INTO order_items (
            order_id, menu_item_id, menu_item_name, quantity, unit_price, subtotal
          ) VALUES ($1, $2, $3, $4, $5, $6)`,
          [
            order.id, item.id, item.name, item.quantity, 
            item.price, item.price * item.quantity
          ]
        );
      }

      // If member order, update member points and create transaction
      if (member_id) {
        // Update member points
        await query(
          'UPDATE members SET points = points + $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
          [points_earned, member_id]
        );

        // Create member transaction for purchase
        await query(
          `INSERT INTO member_transactions (
            member_id, transaction_type, amount, description, balance_after
          ) VALUES ($1, 'purchase', $2, $3, (
            SELECT balance FROM members WHERE id = $1
          ))`,
          [
            member_id, 
            -total_amount, 
            `Order #${order.id.substring(0, 8)} - ${items.map((i: any) => i.name).join(', ')}`
          ]
        );

        // Update member balance if paying with account balance
        if (payment_method === 'account_balance') {
          const memberResult = await query(
            'SELECT balance FROM members WHERE id = $1',
            [member_id]
          );
          
          const currentBalance = parseFloat(memberResult.rows[0].balance);
          if (currentBalance < total_amount) {
            await query('ROLLBACK');
            return NextResponse.json({ 
              error: 'Insufficient account balance' 
            }, { status: 400 });
          }

          await query(
            'UPDATE members SET balance = balance - $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
            [total_amount, member_id]
          );
        }
      }

      // Commit transaction
      await query('COMMIT');

      return NextResponse.json({
        success: true,
        order: {
          id: order.id,
          customer_name: order.customer_name,
          total_amount: parseFloat(order.total_amount),
          status: order.status,
          order_type: order.order_type,
          points_earned: order.points_earned,
          created_at: order.created_at
        },
        message: 'Order placed successfully'
      }, { status: 201 });

    } catch (error) {
      await query('ROLLBACK');
      throw error;
    }

  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 });
  }
}