const { Pool } = require('pg');
require('dotenv').config();

// Get the connection string from environment variables
const connectionString = process.env.DATABASE_URL;
console.log('Using database connection:', connectionString);

// Create a new pool
const pool = new Pool({
  connectionString: connectionString,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

async function testDatabase() {
  try {
    // Test basic connection
    const connectionResult = await pool.query('SELECT NOW()');
    console.log('Database connection successful:', connectionResult.rows[0].now);
    
    // List all schemas
    const schemasResult = await pool.query('SELECT schema_name FROM information_schema.schemata');
    console.log('Available schemas:', schemasResult.rows.map(row => row.schema_name));
    
    // Get current schema
    const currentSchemaResult = await pool.query('SELECT current_schema()');
    console.log('Current schema:', currentSchemaResult.rows[0].current_schema);
    
    // Set search path explicitly
    await pool.query('SET search_path TO public');
    console.log('Search path set to public');
    
    // List all tables in the current schema
    const tablesResult = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);
    console.log('Tables in public schema:', tablesResult.rows.map(row => row.table_name));
    
    // Try to query the menu_items table
    try {
      const menuItemsResult = await pool.query('SELECT * FROM menu_items LIMIT 5');
      console.log('Menu items query successful:', menuItemsResult.rows);
    } catch (error) {
      console.error('Error querying menu_items table:', error.message);
      
      // Check if the table exists
      const tableExistsResult = await pool.query(`
        SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_schema = 'public' 
          AND table_name = 'menu_items'
        )
      `);
      console.log('menu_items table exists:', tableExistsResult.rows[0].exists);
      
      if (!tableExistsResult.rows[0].exists) {
        console.log('The menu_items table does not exist. Please run the seed script to create the database schema.');
      }
    }
  } catch (error) {
    console.error('Database connection error:', error);
  } finally {
    // Close the pool
    await pool.end();
  }
}

// Run the test
testDatabase();