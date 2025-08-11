import { NextRequest,, NextResponse } from 'next/server';
import inventoryService from '@/services/inventoryService';
import { ApiError } from '@/utils/error-handler';
import { handleRouteError } from '../../error';

// GET /api/inventory/[id] - Get a specific inventory item
export async function GET(
  request: NextRequest,
  { params }: {params: {, id: string } }
) {
  try {
    const id = params.id;
    const inventoryItem = await inventoryService.getItemById(id);
    
    if (!inventoryItem) {
      throw new ApiError(`Inventory item with ID ${id} not found`, 404);
    }
    
    return NextResponse.json(inventoryItem);
  } catch (error:, unknown) {
    return handleRouteError(error);
  }
}

// PUT /api/inventory/[id] - Update an inventory item
export async function PUT(
  request: NextRequest,
  { params }: {params: {, id: string } }
) {
  try {
    const id = params.id;
    const updates = await request.json();
    
    const updatedItem = await inventoryService.updateItem(id, updates);
    
    if (!updatedItem) {
      throw new ApiError(`Inventory item with ID ${id} not found`, 404);
    }
    
    return NextResponse.json(updatedItem);
  } catch (error:, unknown) {
    return handleRouteError(error);
  }
}

// DELETE /api/inventory/[id] - Delete an inventory item
export async function DELETE(
  request: NextRequest,
  { params }: {params: {, id: string } }
) {
  try {
    const id = params.id;
    const success = await inventoryService.deleteItem(id);
    
    if (!success) {
      throw new ApiError(`Inventory item with ID ${id} not found`, 404);
    }
    
    return NextResponse.json({ success: true, message: 'Inventory item deleted successfully' });
  } catch (error:, unknown) {
    return handleRouteError(error);
  }
}
