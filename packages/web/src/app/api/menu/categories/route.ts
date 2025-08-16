import { NextRequest, NextResponse } from 'next/server';
import { listMenuCategories } from '@/server/services/menu.service';

export async function GET(_request: NextRequest) {
  try {
    const categories = await listMenuCategories();
    return NextResponse.json({ success: true, data: categories });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}