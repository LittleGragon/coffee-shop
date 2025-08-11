import { NextRequest, NextResponse } from 'next/server';
import menuService from '@/services/menuService';
import { ApiError } from '@/utils/error-handler';
import { handleRouteError } from '../../../error';

// PUT /api/menu/[id]/toggle-availability - Toggle menu item availability
export async function PUT(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const { id } = context.params;
    const updatedItem = await menuService.toggleItemAvailability(id);
    
    if (!updatedItem) {
      return NextResponse.json(
        { error: `Menu item with ID ${id} not found` },
        { status: 404 }
      );
    }
    
    return NextResponse.json(updatedItem);
  } catch (error: unknown) {
    return handleRouteError(error);
  }
}