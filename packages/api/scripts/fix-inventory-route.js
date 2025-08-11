const fs = require('fs');
const path = require('path');

// Fix the inventory route file
const inventoryRoutePath = path.join(__dirname, '../src/app/api/inventory/route.ts');
let inventoryRouteContent = fs.readFileSync(inventoryRoutePath, 'utf8');

// Clean up the file content by fixing the syntax errors
const fixedInventoryRouteContent = `import { NextRequest, NextResponse } from 'next/server';
import { inventoryService } from '@/services/inventoryService';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    
    const inventoryItems = await inventoryService.getAllItems({ category });
    
    return NextResponse.json({
      success: true,
      data: inventoryItems,
    });
  } catch (error) {
    console.error('Error fetching inventory items:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch inventory items', error: (error as Error).message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const newItem = await inventoryService.addItem(body);
    
    return NextResponse.json({
      success: true,
      data: newItem,
    }, { status: 201 });
  } catch (error) {
    console.error('Error adding inventory item:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to add inventory item', error: (error as Error).message },
      { status: 500 }
    );
  }
}`;

fs.writeFileSync(inventoryRoutePath, fixedInventoryRouteContent);
console.log('Fixed inventory route file');