-- Sample data for menu_items
INSERT INTO menu_items (name, price, category, description, image_url, is_available)
VALUES 
  ('Espresso', 3.50, 'Coffee', 'Strong black coffee made by forcing steam through ground coffee beans', 'https://images.unsplash.com/photo-1510591509098-f4b5d5f0f01a', true),
  ('Cappuccino', 4.50, 'Coffee', 'Espresso with steamed milk and foam', 'https://images.unsplash.com/photo-1534778101976-62847782c213', true),
  ('Latte', 4.75, 'Coffee', 'Espresso with steamed milk', 'https://images.unsplash.com/photo-1570968915860-54d5c301fa9f', true),
  ('Americano', 3.75, 'Coffee', 'Espresso with hot water', 'https://images.unsplash.com/photo-1551030173-122aabc4489c', true),
  ('Mocha', 5.25, 'Coffee', 'Espresso with chocolate and steamed milk', 'https://images.unsplash.com/photo-1578314675249-a6910f80cc4e', true),
  ('Croissant', 3.25, 'Pastry', 'Buttery, flaky pastry', 'https://images.unsplash.com/photo-1555507036-ab1f4038808a', true),
  ('Blueberry Muffin', 3.50, 'Pastry', 'Moist muffin filled with blueberries', 'https://images.unsplash.com/photo-1607958996333-41784c70c86d', true),
  ('Chocolate Chip Cookie', 2.50, 'Pastry', 'Classic cookie with chocolate chips', 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e', true),
  ('Avocado Toast', 8.50, 'Food', 'Toasted bread with avocado spread', 'https://images.unsplash.com/photo-1603046891744-76e6481cf539', true),
  ('Breakfast Sandwich', 7.50, 'Food', 'Egg, cheese, and bacon on a bagel', 'https://images.unsplash.com/photo-1550507992-eb63ffee0847', true);

-- Sample data for inventory_items
INSERT INTO inventory_items (name, sku, category, current_stock, minimum_stock, unit, cost_per_unit)
VALUES 
  ('Coffee Beans (Arabica)', 'CB-ARA-001', 'Ingredients', 50.0, 10.0, 'kg', 15.00),
  ('Milk', 'MILK-001', 'Ingredients', 30.0, 5.0, 'liters', 2.50),
  ('Sugar', 'SUGAR-001', 'Ingredients', 25.0, 5.0, 'kg', 1.75),
  ('Chocolate Syrup', 'CHOC-SYR-001', 'Ingredients', 10.0, 2.0, 'bottles', 4.50),
  ('Paper Cups (Small)', 'CUP-SM-001', 'Supplies', 200.0, 50.0, 'pieces', 0.10),
  ('Paper Cups (Medium)', 'CUP-MD-001', 'Supplies', 150.0, 30.0, 'pieces', 0.15),
  ('Paper Cups (Large)', 'CUP-LG-001', 'Supplies', 100.0, 20.0, 'pieces', 0.20),
  ('Napkins', 'NAP-001', 'Supplies', 500.0, 100.0, 'pieces', 0.02),
  ('Coffee Filters', 'FILT-001', 'Supplies', 300.0, 50.0, 'pieces', 0.05),
  ('To-Go Lids', 'LID-001', 'Supplies', 400.0, 75.0, 'pieces', 0.08);

-- Sample data for inventory_transactions
INSERT INTO inventory_transactions (inventory_item_id, type, quantity, created_by, notes)
VALUES 
  ((SELECT id FROM inventory_items WHERE sku = 'CB-ARA-001'), 'restock', 50.0, 'Admin', 'Initial stock'),
  ((SELECT id FROM inventory_items WHERE sku = 'MILK-001'), 'restock', 30.0, 'Admin', 'Initial stock'),
  ((SELECT id FROM inventory_items WHERE sku = 'SUGAR-001'), 'restock', 25.0, 'Admin', 'Initial stock');

-- Sample data for orders
INSERT INTO orders (user_id, status, total_amount, order_type, customization)
VALUES 
  (NULL, 'completed', 12.75, 'standard', '{"notes": "Extra hot"}'),
  (NULL, 'completed', 8.25, 'standard', NULL),
  (NULL, 'pending', 15.50, 'standard', '{"notes": "No sugar"}');

-- Sample data for order_items (assuming we have menu items and orders)
INSERT INTO order_items (order_id, menu_item_id, quantity, price_at_time)
VALUES 
  ((SELECT id FROM orders LIMIT 1 OFFSET 0), (SELECT id FROM menu_items WHERE name = 'Latte'), 2, 4.75),
  ((SELECT id FROM orders LIMIT 1 OFFSET 0), (SELECT id FROM menu_items WHERE name = 'Croissant'), 1, 3.25),
  ((SELECT id FROM orders LIMIT 1 OFFSET 1), (SELECT id FROM menu_items WHERE name = 'Americano'), 1, 3.75),
  ((SELECT id FROM orders LIMIT 1 OFFSET 1), (SELECT id FROM menu_items WHERE name = 'Chocolate Chip Cookie'), 2, 2.50),
  ((SELECT id FROM orders LIMIT 1 OFFSET 2), (SELECT id FROM menu_items WHERE name = 'Mocha'), 2, 5.25),
  ((SELECT id FROM orders LIMIT 1 OFFSET 2), (SELECT id FROM menu_items WHERE name = 'Blueberry Muffin'), 1, 3.50);

-- Sample data for reservations
INSERT INTO reservations (customer_name, customer_phone, party_size, reservation_time, status)
VALUES 
  ('John Smith', '555-123-4567', 2, NOW() + INTERVAL '1 day', 'confirmed'),
  ('Jane Doe', '555-987-6543', 4, NOW() + INTERVAL '2 days', 'confirmed'),
  ('Mike Johnson', '555-456-7890', 6, NOW() + INTERVAL '3 days', 'pending');