import { NextRequest, NextResponse } from 'next/server';
import menuService from '@/services/menuService';
import { ApiError } from '@/utils/error-handler';
import { handleRouteError } from '../../error';

// POST /api/menu/delete - Delete a menu item
export async function POST(request: NextRequest) {
  try {
    // Get the ID from the request body
    const data = await request.json();
    const { id } = data;
    
    if (!id) {
      console.error('Missing ID parameter');
      return NextResponse.json(
        { error: 'Missing ID parameter' },
        { status: 400 }
      );
    }
    
    console.log(`Attempting to delete menu item with ID: ${id}`);
    
    const success = await menuService.deleteItem(id);
    
    if (!success) {
      console.log(`Menu item with ID ${id} not found`);
      return NextResponse.json(
        { error: `Menu item with ID ${id} not found` },
        { status: 404 }
      );
    }
    
    console.log(`Successfully deleted menu item with ID: ${id}`);
    return NextResponse.json({ success: true, message: 'Menu item deleted successfully' });
  } catch (error: unknown) {
    return handleRouteError(error);
  }
}