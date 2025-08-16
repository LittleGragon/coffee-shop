import { Pool } from 'pg';

const connectionString =
  process.env.DATABASE_URL || 'postgres://postgres:postgres@127.0.0.1:5432/coffee_shop_buddy';

// In production (or some hosted environments), SSL may be required.
// For local dev default to no SSL.
const ssl =
  process.env.NODE_ENV === 'production'
    ? { rejectUnauthorized: false }
    : false;

const pool = new Pool({
  connectionString,
  ssl: (ssl as any) // pg types accept boolean | tls.TlsOptions
});

export async function query<T = any>(text: string, params: any[] = []): Promise<T[]> {
  const client = await pool.connect();
  try {
    const res = await client.query(text, params);
    return res.rows as T[];
  } finally {
    client.release();
  }
}