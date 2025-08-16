import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(_request: NextRequest) {
  try {
    const rows = await query<{ category: string }>(
      'SELECT DISTINCT category FROM public.menu_items ORDER BY category'
    );
    const categories = rows.map((r) => r.category);
    return NextResponse.json({ success: true, data: categories });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}
