import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { query } from '@/lib/db';
import { ApiError } from '@/lib/api-error';
import { handleRouteError } from '@/lib/api-error';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

function requireUserId(request: NextRequest): string {
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new ApiError('No token provided', 401);
  }
  const token = authHeader.substring(7);
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; email: string };
    return decoded.userId;
  } catch {
    throw new ApiError('Invalid token', 401);
  }
}

// GET /api/orders/member?limit=20
// Returns authenticated user's orders with aggregated items
export async function GET(request: NextRequest) {
  try {
    const userId = requireUserId(request);
    const { searchParams } = new URL(request.url);
    const limit = Number.parseInt(searchParams.get('limit') ?? '20', 10);

    type Row = {
      id: string;
      total_amount: string;
      status: string;
      order_type: string;
      created_at: string;
      items: any;
    };

    const rows = await query<Row>(
      `
      SELECT
        o.id,
        o.total_amount::text AS total_amount,
        o.status,
        o.order_type,
        o.created_at,
        COALESCE(
          json_agg(
            json_build_object(
              'id', oi.id,
              'menu_item_id', oi.menu_item_id,
              'quantity', oi.quantity,
              'unit_price', oi.price_at_time,
              'subtotal', (oi.price_at_time * oi.quantity)
            )
          ) FILTER (WHERE oi.id IS NOT NULL),
          '[]'::json
        ) AS items
      FROM orders o
      LEFT JOIN order_items oi ON oi.order_id = o.id
      WHERE o.user_id = $1
      GROUP BY o.id
      ORDER BY o.created_at DESC
      LIMIT $2
      `,
      [userId, isNaN(limit) ? 20 : limit]
    );

    const orders = rows.map((r) => ({
      id: r.id,
      total_amount: parseFloat(r.total_amount),
      status: r.status,
      order_type: r.order_type,
      created_at: r.created_at,
      items: Array.isArray(r.items)
        ? r.items.map((it: any) => ({
            id: it.id,
            menu_item_id: it.menu_item_id,
            quantity: Number(it.quantity),
            unit_price: Number(it.unit_price),
            subtotal: Number(it.subtotal)
          }))
        : []
    }));

    return NextResponse.json({ success: true, orders });
  } catch (error) {
    return handleRouteError(error);
  }
}