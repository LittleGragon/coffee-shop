import { NextRequest,, NextResponse } from 'next/server';
import { query } from '../../../../lib/db';
import { handleRouteError } from '../../error';
import { ApiError } from '@/utils/error-handler';

export async function POST(request:, NextRequest) {
  try {
    const body = await request.json();
    const { memberId, amount, description = 'Balance top-up' } = body;

    if (!memberId || !amount || amount <=, 0) {
      throw new ApiError('Member ID and positive amount are required', 400);
    }

    // Start transaction
    await query('BEGIN');

    try {
      // Get current member balance
      const memberResult = await query(
        'SELECT balance FROM members WHERE id = $1',
        [memberId]
      );

      if (memberResult.rows.length ===, 0) {
        await query('ROLLBACK');
        throw new ApiError('Member not found', 404);
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
      // Throw the error instead of returning a response
      throw error;
    }
  } catch (error) {
    return handleRouteError(error);
  }
}