-- Create reward_transactions table for points ledger
CREATE TABLE IF NOT EXISTS reward_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  points INTEGER NOT NULL,
  type VARCHAR(20) NOT NULL, -- 'earn' | 'redeem'
  reason TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Helpful index
CREATE INDEX IF NOT EXISTS idx_reward_transactions_user_created_at
  ON reward_transactions(user_id, created_at DESC);