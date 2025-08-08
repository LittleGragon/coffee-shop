import { Pool } from 'pg';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Create a PostgreSQL connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgres://localhost:5432/coffee_shop_buddy',
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Helper function to execute database queries
export async function executeQuery<T>(text: string, params: any[] = []): Promise<T[]> {
  const client = await pool.connect();
  try {
    await client.query('SET search_path TO public');
    const result = await client.query(text, params);
    return result.rows as T[];
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  } finally {
    client.release();
  }
}

// Test the database connection
export async function testConnection(): Promise<boolean> {
  try {
    const result = await executeQuery<{ now: Date }>('SELECT NOW()');
    console.log('Database connected successfully:', result[0].now);
    return true;
  } catch (error) {
    console.error('Database connection error:', error);
    return false;
  }
}

// Close the pool when the application shuts down
process.on('SIGINT', async () => {
  console.log('Closing database connection pool...');
  await pool.end();
  console.log('Database connection pool closed');
  process.exit(0);
});

export default pool;