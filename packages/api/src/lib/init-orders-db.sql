-- Create orders table if it doesn't exist
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name VARCHAR(255) NOT NULL,
  customer_email VARCHAR(255),
  customer_phone VARCHAR(50),
  member_id UUID REFERENCES members(id),
  total_amount DECIMAL(10,2) NOT NULL,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'preparing', 'ready', 'completed', 'cancelled')),
  order_type VARCHAR(20) DEFAULT 'takeout' CHECK (order_type IN ('dine-in', 'takeout', 'delivery')),
  notes TEXT,
  points_earned INTEGER DEFAULT 0,
  points_used INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create order_items table if it doesn't exist
CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  menu_item_id UUID NOT NULL,
  menu_item_name VARCHAR(255) NOT NULL,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  unit_price DECIMAL(10,2) NOT NULL,
  subtotal DECIMAL(10,2) NOT NULL,
  customizations TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_orders_member_id ON orders(member_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_menu_item_id ON order_items(menu_item_id);

-- Insert sample order data
INSERT INTO orders (customer_name, customer_email, member_id, total_amount, status, order_type, points_earned)
SELECT 
  'John Doe',
  'john.doe@example.com',
  m.id,
  4.50,
  'completed',
  'takeout',
  4
FROM members m
WHERE m.email = 'john.doe@example.com'
ON CONFLICT DO NOTHING;

-- Insert sample order items
INSERT INTO order_items (order_id, menu_item_id, menu_item_name, quantity, unit_price, subtotal)
SELECT 
  o.id,
  mi.id,
  mi.name,
  1,
  mi.price,
  mi.price
FROM orders o
JOIN members m ON o.member_id = m.id
JOIN menu_items mi ON mi.name = 'Cappuccino'
WHERE m.email = 'john.doe@example.com'
  AND o.total_amount = 4.50
ON CONFLICT DO NOTHING;