const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Get the connection string from environment variables
const connectionString = process.env.DATABASE_URL;
console.log('Using database connection:', connectionString);

// Create a new pool
const pool = new Pool({
  connectionString: connectionString,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

async function seedDatabase() {
  try {
    console.log('Starting database seeding...');
    
    // Read the schema SQL file from the original coffee-ops project
    // You may need to adjust this path if the structure is different
    const schemaPath = path.join(__dirname, '../../coffee-ops/src/db/schema.sql');
    const seedPath = path.join(__dirname, '../../coffee-ops/src/db/seed.sql');
    
    let schemaSql;
    let seedSql;
    
    try {
      schemaSql = fs.readFileSync(schemaPath, 'utf8');
      console.log('Schema SQL file loaded successfully');
    } catch (error) {
      console.error('Error reading schema SQL file:', error.message);
      console.log('Creating schema manually...');
      schemaSql = `
        -- Menu Items table
        CREATE TABLE IF NOT EXISTS menu_items (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          name VARCHAR(255) NOT NULL,
          price DECIMAL(10, 2) NOT NULL,
          category VARCHAR(50) NOT NULL,
          image_url VARCHAR(2048),
          description TEXT,
          is_available BOOLEAN NOT NULL DEFAULT TRUE,
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );

        -- Inventory Items table
        CREATE TABLE IF NOT EXISTS inventory_items (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          name VARCHAR(255) NOT NULL,
          sku VARCHAR(255) NOT NULL UNIQUE,
          category VARCHAR(50) NOT NULL,
          current_stock DECIMAL(10, 2) NOT NULL DEFAULT 0,
          minimum_stock DECIMAL(10, 2) NOT NULL DEFAULT 0,
          unit VARCHAR(50) NOT NULL,
          cost_per_unit DECIMAL(10, 2) NOT NULL,
          supplier VARCHAR(255),
          last_restock_date TIMESTAMPTZ,
          expiry_date TIMESTAMPTZ,
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );

        -- Orders table
        CREATE TABLE IF NOT EXISTS orders (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          user_id UUID,
          total_amount DECIMAL(10, 2) NOT NULL,
          status VARCHAR(50) NOT NULL DEFAULT 'pending',
          order_type VARCHAR(50) NOT NULL DEFAULT 'standard',
          customization JSONB,
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );

        -- Order Items table
        CREATE TABLE IF NOT EXISTS order_items (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          order_id UUID NOT NULL,
          menu_item_id UUID NOT NULL,
          quantity INTEGER NOT NULL DEFAULT 1,
          price_at_time DECIMAL(10, 2) NOT NULL
        );

        -- Reservations table
        CREATE TABLE IF NOT EXISTS reservations (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          user_id UUID,
          customer_name VARCHAR(255) NOT NULL,
          customer_phone VARCHAR(50) NOT NULL,
          party_size INTEGER NOT NULL,
          reservation_time TIMESTAMPTZ NOT NULL,
          status VARCHAR(50) NOT NULL DEFAULT 'confirmed',
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );

        -- Create indexes for better performance
        CREATE INDEX IF NOT EXISTS idx_menu_items_category ON menu_items(category);
        CREATE INDEX IF NOT EXISTS idx_inventory_items_category ON inventory_items(category);
        CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
        CREATE INDEX IF NOT EXISTS idx_reservations_status ON reservations(status);
        CREATE INDEX IF NOT EXISTS idx_reservations_reservation_time ON reservations(reservation_time);
      `;
    }
    
    try {
      seedSql = fs.readFileSync(seedPath, 'utf8');
      console.log('Seed SQL file loaded successfully');
    } catch (error) {
      console.error('Error reading seed SQL file:', error.message);
      console.log('Creating seed data manually...');
      seedSql = `
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

        -- Sample data for orders
        INSERT INTO orders (user_id, status, total_amount, order_type, customization)
        VALUES 
          (NULL, 'completed', 12.75, 'standard', '{"notes": "Extra hot"}'),
          (NULL, 'completed', 8.25, 'standard', NULL),
          (NULL, 'pending', 15.50, 'standard', '{"notes": "No sugar"}');

        -- Sample data for reservations
        INSERT INTO reservations (customer_name, customer_phone, party_size, reservation_time, status)
        VALUES 
          ('John Smith', '555-123-4567', 2, NOW() + INTERVAL '1 day', 'confirmed'),
          ('Jane Doe', '555-987-6543', 4, NOW() + INTERVAL '2 days', 'confirmed'),
          ('Mike Johnson', '555-456-7890', 6, NOW() + INTERVAL '3 days', 'pending');
      `;
    }
    
    // Execute the schema SQL
    console.log('Creating database schema...');
    await pool.query(schemaSql);
    console.log('Database schema created successfully');
    
    // Execute the seed SQL
    console.log('Seeding database with sample data...');
    await pool.query(seedSql);
    console.log('Database seeded successfully');
    
    // Verify the data was inserted
    const menuItemsResult = await pool.query('SELECT COUNT(*) FROM menu_items');
    console.log(`Inserted ${menuItemsResult.rows[0].count} menu items`);
    
    const inventoryItemsResult = await pool.query('SELECT COUNT(*) FROM inventory_items');
    console.log(`Inserted ${inventoryItemsResult.rows[0].count} inventory items`);
    
    const ordersResult = await pool.query('SELECT COUNT(*) FROM orders');
    console.log(`Inserted ${ordersResult.rows[0].count} orders`);
    
    const reservationsResult = await pool.query('SELECT COUNT(*) FROM reservations');
    console.log(`Inserted ${reservationsResult.rows[0].count} reservations`);
    
    console.log('Database seeding completed successfully');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    // Close the pool
    await pool.end();
  }
}

// Run the seed function
seedDatabase();