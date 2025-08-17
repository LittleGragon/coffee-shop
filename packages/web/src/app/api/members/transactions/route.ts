import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { ApiError } from '@/utils/error-handler';
import { handleRouteError } from '../../error';

// GET /api/members/transactions?memberId=...&limit=50&offset=0
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const memberId = searchParams.get('memberId');
    const limit = Number.parseInt(searchParams.get('limit') ?? '50', 10);
    const offset = Number.parseInt(searchParams.get('offset') ?? '0', 10);

    if (!memberId) {
      throw new ApiError('Member ID is required', 400);
    }

    let rows: any[] = [];
    try {
      rows = await query<any>(
        `SELECT id, member_id, transaction_type, amount::text AS amount, description, balance_after::text AS balance_after, created_at
         FROM member_transactions
         WHERE member_id = $1
         ORDER BY created_at DESC
         LIMIT $2 OFFSET $3`,
        [memberId, isNaN(limit) ? 50 : limit, isNaN(offset) ? 0 : offset]
      );
    } catch (e: any) {
      // If table is missing in this environment, return an empty list gracefully
      if (e?.code === '42P01') {
        rows = [];
      } else {
        throw e;
      }
    }

    const transactions = rows.map((t) => ({
      id: t.id,
      member_id: t.member_id,
      transaction_type: t.transaction_type,
      amount: parseFloat(t.amount),
      description: t.description ?? null,
      balance_after: parseFloat(t.balance_after),
      created_at: t.created_at
    }));

    return NextResponse.json({ success: true, transactions });
  } catch (error) {
    return handleRouteError(error);
  }
}