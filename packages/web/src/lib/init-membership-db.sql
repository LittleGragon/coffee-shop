-- Create members table
CREATE TABLE IF NOT EXISTS members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(50),
  membership_level VARCHAR(20) DEFAULT 'Bronze' CHECK (membership_level IN ('Bronze', 'Silver', 'Gold', 'Platinum')),
  points INTEGER DEFAULT 0,
  balance DECIMAL(10,2) DEFAULT 0.00,
  member_since TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create member_transactions table
CREATE TABLE IF NOT EXISTS member_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id UUID NOT NULL REFERENCES members(id) ON DELETE CASCADE,
  transaction_type VARCHAR(20) NOT NULL CHECK (transaction_type IN ('topup', 'purchase', 'refund')),
  amount DECIMAL(10,2) NOT NULL,
  description TEXT,
  balance_after DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add member_id to orders table if it doesn't exist
ALTER TABLE orders ADD COLUMN IF NOT EXISTS member_id UUID REFERENCES members(id);
ALTER TABLE orders ADD COLUMN IF NOT EXISTS points_earned INTEGER DEFAULT 0;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS points_used INTEGER DEFAULT 0;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_members_email ON members(email);
CREATE INDEX IF NOT EXISTS idx_member_transactions_member_id ON member_transactions(member_id);
CREATE INDEX IF NOT EXISTS idx_member_transactions_created_at ON member_transactions(created_at);
CREATE INDEX IF NOT EXISTS idx_orders_member_id ON orders(member_id);

-- Insert sample member data
INSERT INTO members (name, email, phone, membership_level, points, balance, member_since) 
VALUES 
  ('John Doe', 'john.doe@example.com', '+1234567890', 'Gold', 1250, 45.50, '2024-01-15'),
  ('Jane Smith', 'jane.smith@example.com', '+1987654321', 'Silver', 800, 25.00, '2024-03-20'),
  ('Mike Johnson', 'mike.johnson@example.com', '+1122334455', 'Bronze', 300, 10.75, '2024-06-10')
ON CONFLICT (email) DO NOTHING;

-- Insert sample transaction data
INSERT INTO member_transactions (member_id, transaction_type, amount, description, balance_after)
SELECT 
  m.id,
  'topup',
  50.00,
  'Initial top-up',
  50.00
FROM members m
WHERE m.email = 'john.doe@example.com'
ON CONFLICT DO NOTHING;

INSERT INTO member_transactions (member_id, transaction_type, amount, description, balance_after)
SELECT 
  m.id,
  'purchase',
  -4.50,
  'Cappuccino purchase',
  45.50
FROM members m
WHERE m.email = 'john.doe@example.com'
ON CONFLICT DO NOTHING;