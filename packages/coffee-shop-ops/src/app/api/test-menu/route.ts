import { NextRequest, NextResponse } from 'next/server';
import { executeQuery } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    // Check if the menu_items table exists
    const tableCheck = await executeQuery(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'menu_items'
      );
    `);
    
    const tableExists = tableCheck[0].exists;
    
    if (!tableExists) {
      return NextResponse.json({ 
        status: 'error', 
        message: 'menu_items table does not exist' 
      }, { status: 404 });
    }
    
    // Get table structure
    const tableStructure = await executeQuery(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_schema = 'public' 
      AND table_name = 'menu_items';
    `);
    
    // Count menu items
    const countResult = await executeQuery('SELECT COUNT(*) FROM menu_items');
    const count = countResult[0].count;
    
    // Get a sample of menu items
    const menuItems = await executeQuery('SELECT * FROM menu_items LIMIT 5');
    
    return NextResponse.json({ 
      status: 'success', 
      tableExists,
      tableStructure,
      count,
      sampleItems: menuItems
    });
  } catch (error) {
    console.error('Error testing menu items:', error);
    return NextResponse.json({ 
      status: 'error', 
      message: 'Error testing menu items',
      error: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}