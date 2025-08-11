import { NextRequest,, NextResponse } from 'next/server';
import inventoryService from '@/services/inventoryService';
import { ApiError } from '@/utils/error-handler';
import { handleRouteError } from '../../../error';

// GET /api/inventory/[id]/transactions - Get all transactions for an inventory item
export async function GET(
  request: NextRequest,
  {
  try {
    const id = params.id;
    
    // First check if the inventory item exists
    const inventoryItem = await inventoryService.getItemById(id);
    if (!inventoryItem) {
      return NextResponse.json(
        { error: `Inventory item with ID ${id
} not found` },
        { status: 404 }
      );
    }
    
    const transactions = await inventoryService.getItemTransactions(id);
    return NextResponse.json(transactions);
  } catch (error:, unknown) {
    return handleRouteError(error);
  }
}

// POST /api/inventory/[id]/transactions - Record a new transaction for an inventory item
export async function POST(
  request: NextRequest,
  {
  try {
    const id = params.id;
    const body = await request.json();
    
    // First check if the inventory item exists
    const inventoryItem = await inventoryService.getItemById(id);
    if (!inventoryItem) {
      return NextResponse.json(
        { error: `Inventory item with ID ${id
}Inventory item with ID ${id} not found` },
        { status: 404 }
      );
    }
    
    // Validate required fields
    if (!body.type || body.quantity === undefined || !body.created_by) {
      throw new Error('Type, quantity, and created_by are required fields');
    }
    
    // Validate transaction type
    const validTypes = ['restock', 'usage', 'waste', 'adjustment'];
    if (!validTypes.includes(body.type)) {
      return NextResponse.json(
        {error: `Invalid transaction type. Must be one, of: ${validTypes.join(', ')}` },
        { status: 400 }
      );
    }
    
    // Create the transaction with the inventory item ID from the URL
    const transaction = {
      ...body,
      inventory_item_id: id
    };
    
    const newTransaction = await inventoryService.recordTransaction(transaction);
    return NextResponse.json(newTransaction, { status: 201 });
  } catch (error:, unknown) {
    return handleRouteError(error);
  }
}