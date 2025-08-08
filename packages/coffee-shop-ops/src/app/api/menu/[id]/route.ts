import { NextRequest, NextResponse } from 'next/server';
import menuService from '@/services/menuService';

// GET /api/menu/[id] - Get a specific menu item
export async function GET(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const id = context.params.id;
    const menuItem = await menuService.getItemById(id);
    
    if (!menuItem) {
      return NextResponse.json(
        { error: `Menu item with ID ${id} not found` },
        { status: 404 }
      );
    }
    
    return NextResponse.json(menuItem);
  } catch (error) {
    console.error(`Error fetching menu item:`, error);
    return NextResponse.json(
      { error: 'Failed to fetch menu item' },
      { status: 500 }
    );
  }
}

// PUT /api/menu/[id] - Update a menu item
export async function PUT(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const id = context.params.id;
    const updates = await request.json();
    
    const updatedItem = await menuService.updateItem(id, updates);
    
    if (!updatedItem) {
      return NextResponse.json(
        { error: `Menu item with ID ${id} not found` },
        { status: 404 }
      );
    }
    
    return NextResponse.json(updatedItem);
  } catch (error) {
    console.error(`Error updating menu item:`, error);
    return NextResponse.json(
      { error: 'Failed to update menu item' },
      { status: 500 }
    );
  }
}

// DELETE /api/menu/[id] - Delete a menu item
export async function DELETE(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const id = context.params.id;
    const success = await menuService.deleteItem(id);
    
    if (!success) {
      return NextResponse.json(
        { error: `Menu item with ID ${id} not found` },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true, message: 'Menu item deleted successfully' });
  } catch (error) {
    console.error(`Error deleting menu item:`, error);
    return NextResponse.json(
      { error: 'Failed to delete menu item' },
      { status: 500 }
    );
  }
}