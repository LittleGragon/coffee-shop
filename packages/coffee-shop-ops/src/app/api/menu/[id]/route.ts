import { NextRequest, NextResponse } from 'next/server';
import menuService from '@/services/menuService';

// Support for form-based DELETE requests
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const formData = await request.formData();
  const method = formData.get('_method');
  
  if (method === 'DELETE') {
    return handleDelete(params);
  }
  
  return NextResponse.json(
    { error: 'Invalid method override' },
    { status: 400 }
  );
}

async function handleDelete(params: { id: string }) {
  try {
    const id = params.id;
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
  } catch (error) {
    console.error(`Error deleting menu item:`, error);
    return NextResponse.json(
      { error: 'Failed to delete menu item' },
      { status: 500 }
    );
  }
}

// GET /api/menu/[id] - Get a specific menu item
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    if (!id) {
      console.error('Missing ID parameter');
      return NextResponse.json(
        { error: 'Missing ID parameter' },
        { status: 400 }
      );
    }
    console.log(`Fetching menu item with ID: ${id}`);
    
    const menuItem = await menuService.getItemById(id);
    
    if (!menuItem) {
      console.log(`Menu item with ID ${id} not found`);
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
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    if (!id) {
      console.error('Missing ID parameter');
      return NextResponse.json(
        { error: 'Missing ID parameter' },
        { status: 400 }
      );
    }
    console.log(`Updating menu item with ID: ${id}`);
    
    const updates = await request.json();
    const updatedItem = await menuService.updateItem(id, updates);
    
    if (!updatedItem) {
      console.log(`Menu item with ID ${id} not found for update`);
      return NextResponse.json(
        { error: `Menu item with ID ${id} not found` },
        { status: 404 }
      );
    }
    
    console.log(`Successfully updated menu item with ID: ${id}`);
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
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
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
  } catch (error) {
    console.error(`Error deleting menu item:`, error);
    return NextResponse.json(
      { error: 'Failed to delete menu item' },
      { status: 500 }
    );
  }
}
