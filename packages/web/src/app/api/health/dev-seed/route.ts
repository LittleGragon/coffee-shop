import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
  try {
    // Ensure extension for UUID
    await query('CREATE EXTENSION IF NOT EXISTS pgcrypto;');

    // Core auth/users (for real auth)
    await query(`
      CREATE TABLE IF NOT EXISTS public.users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        balance DECIMAL(10, 2) DEFAULT 0.00,
        member_since DATE DEFAULT CURRENT_DATE,
        created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
      )
    `);
    await query('CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email)');

    // Orders + items
    await query(`
      CREATE TABLE IF NOT EXISTS public.orders (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID,
        total_amount DECIMAL(10, 2) NOT NULL,
        status VARCHAR(50) NOT NULL DEFAULT 'pending',
        order_type VARCHAR(50) NOT NULL DEFAULT 'dine-in',
        customization JSONB,
        created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
      )
    `);
    await query(`
      CREATE TABLE IF NOT EXISTS public.order_items (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
        menu_item_id UUID NOT NULL REFERENCES menu_items(id),
        quantity INTEGER NOT NULL DEFAULT 1,
        price_at_time DECIMAL(10, 2) NOT NULL
      )
    `);

    // Rewards ledger
    await query(`
      CREATE TABLE IF NOT EXISTS public.reward_transactions (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        points INTEGER NOT NULL,
        type VARCHAR(20) NOT NULL,
        reason TEXT,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `);

    // Create menu_items table if not exists
    await query(`
      CREATE TABLE IF NOT EXISTS public.menu_items (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(255) NOT NULL,
        price DECIMAL(10, 2) NOT NULL,
        category VARCHAR(100) NOT NULL,
        description TEXT,
        image_url TEXT,
        is_available BOOLEAN DEFAULT true,
        created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Helpful indexes
    await query('CREATE INDEX IF NOT EXISTS idx_menu_items_category ON public.menu_items(category)');
    await query('CREATE INDEX IF NOT EXISTS idx_menu_items_available ON public.menu_items(is_available)');

    // See if table is empty
    const countRows = await query<{ count: string }>('SELECT count(*)::text AS count FROM public.menu_items');
    const before = parseInt(countRows[0]?.count ?? '0', 10);

    if (before === 0) {
      // Seed sample data (id auto-generated)
      await query(`
        INSERT INTO public.menu_items (name, price, category, description, is_available) VALUES
          ('Espresso', 3.00, 'Coffee', 'Rich and bold espresso shot', true),
          ('Americano', 3.50, 'Coffee', 'Espresso with hot water', true),
          ('Latte', 4.50, 'Coffee', 'Espresso with steamed milk', true),
          ('Cappuccino', 4.50, 'Coffee', 'Espresso with steamed milk and foam', true),
          ('Mocha', 5.00, 'Coffee', 'Espresso with chocolate and steamed milk', true),
          ('Green Tea', 3.00, 'Tea', 'Fresh green tea', true),
          ('Black Tea', 3.00, 'Tea', 'Classic black tea', true),
          ('Croissant', 2.50, 'Pastry', 'Buttery French croissant', true),
          ('Blueberry Muffin', 2.75, 'Pastry', 'Fresh blueberry muffin', true),
          ('Chocolate Chip Cookie', 2.00, 'Pastry', 'Homemade chocolate chip cookie', true),
          ('Avocado Toast', 6.00, 'Food', 'Toasted bread with fresh avocado', true),
          ('Breakfast Sandwich', 5.50, 'Food', 'Egg, cheese, and bacon on a bun', true)
      `);
    }

    const afterRows = await query<{ count: string }>('SELECT count(*)::text AS count FROM public.menu_items');
    const after = parseInt(afterRows[0]?.count ?? '0', 10);

    return NextResponse.json({
      ok: true,
      seeded: before === 0 && after > 0,
      before,
      after
    });
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: e?.message || String(e) },
      { status: 500 }
    );
  }
}