import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { handleRouteError } from '@/lib/api-error';

// Minimal rewards API with graceful DB fallback.
// GET  /api/rewards          -> { success, balance, history, redeemables }
// POST /api/rewards {rewardId:number} -> { success, redeemed:{id, cost} }

type RewardRow = { id: number; name: string; cost_points: number };
type TxRow = { id: string; delta_points: string; description: string; created_at: string };
type BalanceRow = { points: string };

function mockPayload() {
  return {
    success: true,
    balance: 2750,
    history: [
      { id: 'tx-1', delta_points: +12, description: 'Americano', created_at: new Date().toISOString() },
      { id: 'tx-2', delta_points: +12, description: 'Latte', created_at: new Date().toISOString() },
    ],
    redeemables: [
      { id: 1, name: 'Latte', cost_points: 1340 },
      { id: 2, name: 'Flat White', cost_points: 1340 },
      { id: 3, name: 'Cappuccino', cost_points: 1340 },
    ],
  };
}

export async function GET(_req: NextRequest) {
  try {
    // Try to read from DB; if tables are missing, return mock.
    try {
      const balances = await query<BalanceRow>(
        `SELECT COALESCE(SUM(delta_points),0)::text AS points FROM reward_transactions`
      );
      const tx = await query<TxRow>(
        `SELECT id::text AS id, delta_points::text AS delta_points, description, created_at
         FROM reward_transactions ORDER BY created_at DESC LIMIT 50`
      );
      const items = await query<RewardRow>(
        `SELECT id, name, cost_points FROM redeemable_rewards ORDER BY id ASC LIMIT 50`
      );

      const balance = parseFloat(balances?.[0]?.points || '0');
      const history = (tx || []).map((r) => ({
        id: r.id,
        delta_points: parseFloat(r.delta_points),
        description: r.description,
        created_at: r.created_at,
      }));
      const redeemables = (items || []).map((r) => ({
        id: r.id,
        name: r.name,
        cost_points: r.cost_points,
      }));

      return NextResponse.json({ success: true, balance, history, redeemables });
    } catch (e: any) {
      // Table does not exist or other DB error: use mock
      if (e?.code === '42P01') {
        return NextResponse.json(mockPayload());
      }
      throw e;
    }
  } catch (error) {
    return handleRouteError(error);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const rewardId = Number(body?.rewardId);
    if (!Number.isFinite(rewardId)) {
      return NextResponse.json({ success: false, error: 'rewardId required' }, { status: 400 });
    }

    // Redeem against DB if possible; otherwise return mock success.
    try {
      const reward = (await query<RewardRow>(
        `SELECT id, name, cost_points FROM redeemable_rewards WHERE id = $1`,
        [rewardId]
      ))[0];
      if (!reward) {
        return NextResponse.json({ success: false, error: 'Reward not found' }, { status: 404 });
      }

      // Deduct points by inserting a negative delta transaction
      await query(
        `INSERT INTO reward_transactions (delta_points, description, created_at)
         VALUES ($1, $2, NOW())`,
        [-Math.abs(reward.cost_points), `Redeem ${reward.name}`]
      );

      return NextResponse.json({ success: true, redeemed: { id: reward.id, cost: reward.cost_points } });
    } catch (e: any) {
      if (e?.code === '42P01') {
        // Missing tables: pretend success for now
        return NextResponse.json({ success: true, redeemed: { id: rewardId, cost: 1340 } });
      }
      throw e;
    }
  } catch (error) {
    return handleRouteError(error);
  }
}