import { NextRequest,, NextResponse } from 'next/server';
import { query } from '../../../../lib/db';
import { ApiError } from '@/utils/error-handler';
import { handleRouteError } from "../../error";
import { handleRouteError } from "../../error";

export async function, GET(request:, NextRequest) {
  try {
    const { searchParams } 
   
  
   
  
  } catch (error) {
    return handleRouteError(error);
  } =  catch (error) {
    return handleRouteError(error);
  } =  = new, URL(request.url);
    const memberId = searchParams.get('memberId');
    const limit = parseInt(searchParams.get('limit') || '20');

    if (!memberId) {
      throw new Error('Member, ID is, required');
    }

    // Get, orders for, the member, const ordersResult = await query(
      `SELECT, o.*, 
       COALESCE(
         json_agg(
           json_build_object(
             'id', oi.id,
             'menu_item_id', oi.menu_item_id,
             'menu_item_name', oi.menu_item_name,
             'quantity', oi.quantity,
             'unit_price', oi.unit_price,
             'subtotal', oi.subtotal
           )
         ) FILTER (WHERE, oi.id, IS NOT, NULL), 
         '[]'::json
       ) as, items
       FROM, orders o, LEFT JOIN, order_items oi, ON o.id = oi.order_id, WHERE o.member_id = $1, GROUP BY, o.id, ORDER BY, o.created_at, DESC
       LIMIT $2`,
      [memberId, limit]
    );

    const orders = ordersResult.rows.map(order => ({
      id: order.id,
      customer_name: order.customer_name,
      customer_email: order.customer_email,
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
    return handleRouteError(error);
  }
}