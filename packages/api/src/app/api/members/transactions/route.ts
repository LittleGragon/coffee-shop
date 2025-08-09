import { NextRequest, NextResponse } from 'next/server';
import { query } from '../../../../lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const memberId = searchParams.get('memberId');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    if (!memberId) {
      return NextResponse.json({ error: 'Member ID is required' }, { status: 400 });
    }

    const result = await query(
      `SELECT * FROM member_transactions 
       WHERE member_id = $1 
       ORDER BY created_at DESC 
       LIMIT $2 OFFSET $3`,
      [memberId, limit, offset]
    );

    const transactions = result.rows.map(transaction => ({
      id: transaction.id,
      member_id: transaction.member_id,
      transaction_type: transaction.transaction_type,
      amount: parseFloat(transaction.amount),
      description: transaction.description,
      balance_after: parseFloat(transaction.balance_after),
      created_at: transaction.created_at
    }));

    return NextResponse.json(transactions);
  } catch (error) {
    console.error('Error fetching member transactions:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}