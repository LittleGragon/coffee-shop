const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');

// Database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgres://postgres:postgres@postgres:5432/coffee_shop_buddy',
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

async function runMigration() {
  const client = await pool.connect();
  
  try {
    console.log('Running categories table migration...');
    
    const migrationPath = path.join(__dirname, '../src/db/migrations/004_create_categories_table.sql');
    const sql = fs.readFileSync(migrationPath, 'utf8');
    
    // Execute the migration
    await client.query(sql);
    
    console.log('✅ Categories table migration completed successfully');
    
    // Verify the table was created
    const result = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name = 'categories'
    `);
    
    if (result.rows.length > 0) {
      console.log('✅ Categories table exists');
      
      // Check if default categories were inserted
      const categoriesCount = await client.query('SELECT COUNT(*) as count FROM categories');
      console.log(`✅ Found ${categoriesCount.rows[0].count} categories in the database`);
      
      // List the categories
      const categories = await client.query('SELECT name, description FROM categories ORDER BY display_order');
      console.log('📋 Available categories:');
      categories.rows.forEach(cat => {
        console.log(`  - ${cat.name}${cat.description ? ': ' + cat.description : ''}`);
      });
    } else {
      console.log('❌ Categories table was not created');
    }
    
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    console.error('Full error:', error);
  } finally {
    client.release();
    await pool.end();
  }
}

// Run the migration
runMigration().catch(console.error);