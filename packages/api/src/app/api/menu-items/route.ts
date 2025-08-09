import { NextRequest, NextResponse } from 'next/server';
import { executeQuery } from '@/lib/db';
import { MenuItem } from '@/types/models';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const available = searchParams.get('available');

    let query = 'SELECT * FROM menu_items';
    const params: any[] = [];
    const conditions: string[] = [];

    if (category) {
      conditions.push('category = $1');
      params.push(category);
    }

    if (available === 'true') {
      const paramIndex = params.length + 1;
      conditions.push(`is_available = $${paramIndex}`);
      params.push(true);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    query += ' ORDER BY category, name';

    const menuItems = await executeQuery<MenuItem>(query, params);

    // If category is specified, return data in the expected format for backward compatibility
    if (category) {
      return NextResponse.json({ data: menuItems });
    }

    // Otherwise return all items grouped by category
    const groupedItems = menuItems.reduce((acc, item) => {
      if (!acc[item.category]) {
        acc[item.category] = [];
      }
      acc[item.category].push(item);
      return acc;
    }, {} as Record<string, MenuItem[]>);

    return NextResponse.json({ data: groupedItems });
  } catch (error) {
    console.error('Error fetching menu items:', error);
    return NextResponse.json(
      { error: 'Failed to fetch menu items' },
      { status: 500 }
    );
  }
}
