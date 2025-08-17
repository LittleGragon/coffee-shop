import { NextRequest, NextResponse } from 'next/server';
import inventoryService from '@/services/inventoryService';
import { handleApiError } from '@/utils/error-handler';

// GET /api/inventory/[id]/transactions - Get all transactions for an inventory item
export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // Verify inventory item exists
    const inventoryItem = await inventoryService.getItemById(id);
    if (!inventoryItem) {
      return NextResponse.json({ error: `Inventory item with ID ${id} not found` }, { status: 404 });
    }

    const transactions = await inventoryService.getItemTransactions(id);
    return NextResponse.json(transactions);
  } catch (error) {
    return handleApiError(error);
  }
}

// POST /api/inventory/[id]/transactions - Record a new transaction for an inventory item
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();

    // Verify inventory item exists
    const inventoryItem = await inventoryService.getItemById(id);
    if (!inventoryItem) {
      return NextResponse.json({ error: `Inventory item with ID ${id} not found` }, { status: 404 });
    }

    // Validate required fields
    if (!body?.type || body.quantity === undefined || !body.created_by) {
      return NextResponse.json(
        { error: 'Type, quantity, and created_by are required fields' },
        { status: 400 }
      );
    }

    const validTypes = ['restock', 'usage', 'waste', 'adjustment'];
    if (!validTypes.includes(body.type)) {
      return NextResponse.json(
        { error: `Invalid transaction type. Must be one of: ${validTypes.join(', ')}` },
        { status: 400 }
      );
    }

    const transaction = {
      ...body,
      inventory_item_id: id,
    };

    const newTransaction = await inventoryService.recordTransaction(transaction);
    return NextResponse.json(newTransaction, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}