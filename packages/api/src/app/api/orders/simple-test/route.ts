import { NextRequest, NextResponse } from 'next/server';
import { query } from '../../../../lib/db';
import { ApiError } from '@/utils/error-handler';
import { handleRouteError } from "../../error";
import { handleRouteError } from "../../error";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      customer_name,
      customer_email,
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

    // Create order without transaction for testing
    const orderResult = await query(
      `INSERT INTO orders (
        customer_name, customer_email, member_id,
        total_amount, status, order_type, notes, points_earned
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [
        customer_name, customer_email, member_id,
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
    return handleRouteError(error);
  }
}