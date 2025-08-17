import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { ApiError } from '@/utils/error-handler';
import { handleRouteError } from '../../error';

// Simple test endpoint to create a minimal order without auth.
// Body: { items: [{ price: number, quantity: number }], order_type?: string }
export async function POST(request: NextRequest) {
  try {
    const { items, order_type = 'dine-in' } = await request.json();

    if (!Array.isArray(items) || items.length === 0) {
      throw new ApiError('Items are required', 400);
    }

    const validated = items.map((it: any) => {
      const quantity = Number(it?.quantity);
      const price = Number(it?.price);
      if (!Number.isFinite(quantity) || quantity <= 0 || !Number.isFinite(price) || price < 0) {
        throw new ApiError('Invalid item payload', 400);
      }
      return { quantity, price };
    });

    const totalAmount = validated.reduce((sum: number, v) => sum + v.quantity * v.price, 0);

    const created = await query<{
      id: string;
      total_amount: string;
      status: string;
      order_type: string;
      created_at: string;
    }>(
      `INSERT INTO orders (user_id, total_amount, status, order_type, customization, created_at)
       VALUES (NULL, $1, 'pending', $2, NULL, NOW())
       RETURNING id, total_amount::text AS total_amount, status, order_type, created_at`,
      [totalAmount, order_type]
    );

    const order = created[0];

    return NextResponse.json(
      {
        success: true,
        order: {
          id: order.id,
          total_amount: parseFloat(order.total_amount),
          status: order.status,
          order_type: order.order_type,
          created_at: order.created_at
        }
      },
      { status: 201 }
    );
  } catch (error) {
    return handleRouteError(error);
  }
}