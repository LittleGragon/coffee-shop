import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { query } from '@/lib/db';
import { ApiError } from '@/utils/error-handler';
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

// GET /api/orders - list current user's orders (summary)
export async function GET(request: NextRequest) {
  try {
    const userId = requireUserId(request);

    const rows = await query<{
      id: string;
      total_amount: string;
      status: string;
      order_type: string;
      created_at: string;
      item_count: string;
    }>(
      `
      SELECT 
        o.id,
        o.total_amount::text AS total_amount,
        o.status,
        o.order_type,
        o.created_at,
        COALESCE(SUM(oi.quantity), 0)::text AS item_count
      FROM orders o
      LEFT JOIN order_items oi ON oi.order_id = o.id
      WHERE o.user_id = $1
      GROUP BY o.id
      ORDER BY o.created_at DESC
      `,
      [userId]
    );

    const orders = rows.map((o) => ({
      id: o.id,
      total_amount: parseFloat(o.total_amount),
      status: o.status,
      order_type: o.order_type,
      item_count: parseInt(o.item_count, 10),
      created_at: o.created_at
    }));

    return NextResponse.json({ success: true, orders });
  } catch (error) {
    return handleRouteError(error);
  }
}

// POST /api/orders - create order from items
// Body: { items: { menu_item_id: string, quantity: number }[], order_type?: string }
export async function POST(request: NextRequest) {
  try {
    const userId = requireUserId(request);
    const body = await request.json();
    const items: Array<{ menu_item_id: string; quantity: number }> = body?.items ?? [];
    const orderType: string = body?.order_type ?? 'dine-in';

    if (!Array.isArray(items) || items.length === 0) {
      throw new ApiError('Items are required', 400);
    }

    // Validate items and compute totals (fetch price for each menu item)
    type PriceRow = { price: string };
    const validated: Array<{ menu_item_id: string; quantity: number; price: number }> = [];

    for (const it of items) {
      if (!it?.menu_item_id || !Number.isFinite(it?.quantity) || it.quantity <= 0) {
        throw new ApiError('Invalid item payload', 400);
      }
      const priceRows = await query<PriceRow>(
        'SELECT price::text AS price FROM menu_items WHERE id = $1',
        [it.menu_item_id]
      );
      if (!priceRows || priceRows.length === 0) {
        throw new ApiError(`Menu item not found: ${it.menu_item_id}`, 404);
      }
      const price = parseFloat(priceRows[0].price);
      validated.push({ menu_item_id: it.menu_item_id, quantity: it.quantity, price });
    }

    const totalAmount = validated.reduce((sum, v) => sum + v.price * v.quantity, 0);

    // Create order
    const createdOrders = await query<{
      id: string;
      user_id: string | null;
      total_amount: string;
      status: string;
      order_type: string;
      created_at: string;
    }>(
      `INSERT INTO orders (user_id, total_amount, status, order_type, customization, created_at)
       VALUES ($1, $2, 'pending', $3, NULL, NOW())
       RETURNING id, user_id, total_amount::text AS total_amount, status, order_type, created_at`,
      [userId, totalAmount, orderType]
    );
    const order = createdOrders[0];

    // Create order items
    for (const v of validated) {
      await query(
        `INSERT INTO order_items (order_id, menu_item_id, quantity, price_at_time)
         VALUES ($1, $2, $3, $4)`,
        [order.id, v.menu_item_id, v.quantity, v.price]
      );
    }

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