const fs = require('fs');
const path = require('path');

// Fix the menu route file
const menuRoutePath = path.join(__dirname, '../src/app/api/menu/route.ts');
let menuRouteContent = fs.readFileSync(menuRoutePath, 'utf8');

// Clean up the file content by fixing the syntax errors
const fixedMenuRouteContent = `import { NextRequest, NextResponse } from 'next/server';
import { menuService } from '@/services/menuService';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const isAvailable = searchParams.get('isAvailable') === 'true';
    
    const menuItems = await menuService.getAllItems({ category, isAvailable });
    
    return NextResponse.json({
      success: true,
      data: menuItems,
    });
  } catch (error) {
    console.error('Error fetching menu items:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch menu items', error: (error as Error).message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const newItem = await menuService.addItem(body);
    
    return NextResponse.json({
      success: true,
      data: newItem,
    }, { status: 201 });
  } catch (error) {
    console.error('Error adding menu item:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to add menu item', error: (error as Error).message },
      { status: 500 }
    );
  }
}`;

fs.writeFileSync(menuRoutePath, fixedMenuRouteContent);
console.log('Fixed menu route file');