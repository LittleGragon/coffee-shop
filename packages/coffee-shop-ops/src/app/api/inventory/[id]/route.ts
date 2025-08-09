import { NextRequest, NextResponse } from 'next/server';
import inventoryService from '@/services/inventoryService';

// GET /api/inventory/[id] - Get a specific inventory item
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const inventoryItem = await inventoryService.getItemById(id);
    
    if (!inventoryItem) {
      return NextResponse.json(
        { error: `Inventory item with ID ${id} not found` },
        { status: 404 }
      );
    }
    
    return NextResponse.json(inventoryItem);
  } catch (error) {
    // console.error(`Error fetching inventory item ${params.id}:`, error);
    return NextResponse.json(
      { error: 'Failed to fetch inventory item' },
      { status: 500 }
    );
  }
}

// PUT /api/inventory/[id] - Update an inventory item
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const updates = await request.json();
    
    const updatedItem = await inventoryService.updateItem(id, updates);
    
    if (!updatedItem) {
      return NextResponse.json(
        { error: `Inventory item with ID ${id} not found` },
        { status: 404 }
      );
    }
    
    return NextResponse.json(updatedItem);
  } catch (error) {
    // console.error(`Error updating inventory item ${params.id}:`, error);
    return NextResponse.json(
      { error: 'Failed to update inventory item' },
      { status: 500 }
    );
  }
}

// DELETE /api/inventory/[id] - Delete an inventory item
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const success = await inventoryService.deleteItem(id);
    
    if (!success) {
      return NextResponse.json(
        { error: `Inventory item with ID ${id} not found` },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true, message: 'Inventory item deleted successfully' });
  } catch (error) {
    // console.error(`Error deleting inventory item ${params.id}:`, error);
    return NextResponse.json(
      { error: 'Failed to delete inventory item' },
      { status: 500 }
    );
  }
}