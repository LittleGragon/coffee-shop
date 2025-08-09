import { NextRequest, NextResponse } from 'next/server';
import { query } from '../../../../lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { memberId, amount, description = 'Balance top-up' } = body;

    if (!memberId || !amount || amount <= 0) {
      return NextResponse.json({ 
        error: 'Member ID and positive amount are required' 
      }, { status: 400 });
    }

    // Start transaction
    await query('BEGIN');

    try {
      // Get current member balance
      const memberResult = await query(
        'SELECT balance FROM members WHERE id = $1',
        [memberId]
      );

      if (memberResult.rows.length === 0) {
        await query('ROLLBACK');
        return NextResponse.json({ error: 'Member not found' }, { status: 404 });
      }

      const currentBalance = parseFloat(memberResult.rows[0].balance);
      const newBalance = currentBalance + amount;

      // Update member balance
      await query(
        'UPDATE members SET balance = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
        [newBalance, memberId]
      );

      // Record transaction
      await query(
        `INSERT INTO member_transactions (member_id, transaction_type, amount, description, balance_after)
         VALUES ($1, 'topup', $2, $3, $4)`,
        [memberId, amount, description, newBalance]
      );

      // Commit transaction
      await query('COMMIT');

      return NextResponse.json({
        success: true,
        newBalance: newBalance,
        message: `Successfully added $${amount.toFixed(2)} to your account`
      });

    } catch (error) {
      await query('ROLLBACK');
      throw error;
    }

  } catch (error) {
    console.error('Error processing top-up:', error);
    return NextResponse.json({ 
      success: false,
      error: 'Internal server error' 
    }, { status: 500 });
  }
}