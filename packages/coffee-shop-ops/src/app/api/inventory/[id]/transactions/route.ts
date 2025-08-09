import { NextRequest, NextResponse } from 'next/server';
import inventoryService from '@/services/inventoryService';

// GET /api/inventory/[id]/transactions - Get all transactions for an inventory item
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    
    // First check if the inventory item exists
    const inventoryItem = await inventoryService.getItemById(id);
    if (!inventoryItem) {
      return NextResponse.json(
        { error: `Inventory item with ID ${id} not found` },
        { status: 404 }
      );
    }
    
    const transactions = await inventoryService.getItemTransactions(id);
    return NextResponse.json(transactions);
  } catch (error) {
    // console.error(`Error fetching transactions for inventory item ${params.id}:`, error);
    return NextResponse.json(
      { error: 'Failed to fetch inventory transactions' },
      { status: 500 }
    );
  }
}

// POST /api/inventory/[id]/transactions - Record a new transaction for an inventory item
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const body = await request.json();
    
    // First check if the inventory item exists
    const inventoryItem = await inventoryService.getItemById(id);
    if (!inventoryItem) {
      return NextResponse.json(
        { error: `Inventory item with ID ${id} not found` },
        { status: 404 }
      );
    }
    
    // Validate required fields
    if (!body.type || body.quantity === undefined || !body.created_by) {
      return NextResponse.json(
        { error: 'Type, quantity, and created_by are required fields' },
        { status: 400 }
      );
    }
    
    // Validate transaction type
    const validTypes = ['restock', 'usage', 'waste', 'adjustment'];
    if (!validTypes.includes(body.type)) {
      return NextResponse.json(
        { error: `Invalid transaction type. Must be one of: ${validTypes.join(', ')}` },
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
  } catch (error) {
    // console.error(`Error recording transaction for inventory item ${params.id}:`, error);
    return NextResponse.json(
      { error: 'Failed to record inventory transaction' },
      { status: 500 }
    );
  }
}