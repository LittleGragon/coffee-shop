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

async function getMenuItems() {
  try {
    console.log('Fetching menu items...');
    
    const result = await pool.query('SELECT id, name, category FROM menu_items');
    
    console.log('Menu items:');
    result.rows.forEach(item => {
      console.log(`ID: ${item.id}, Name: ${item.name}, Category: ${item.category}`);
    });
    
  } catch (error) {
    console.error('Error fetching menu items:', error);
  } finally {
    // Close the pool
    await pool.end();
  }
}

// Run the function
getMenuItems();