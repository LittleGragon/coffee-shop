#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Function to fix the inventory route file
function fixInventoryRouteFile() {
  const filePath = path.join(__dirname, '../src/app/api/inventory/route.ts');
  
  try {
    // Read the file content
    console.log(`Reading file: ${filePath}`);
    const originalContent = fs.readFileSync(filePath, 'utf8');
    
    // Create a corrected version of the file
    const correctedContent = `import { NextRequest, NextResponse } from 'next/server';
import inventoryService from 'coffee-shop-ops/services/inventoryService';
import { ApiError } from '@/utils/error-handler';
import { handleRouteError } from "../error";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category') || undefined;
    const lowStock = searchParams.get('lowStock') === 'true';

    const inventoryItems = await inventoryService.getAllItems({ category, lowStock });
    return NextResponse.json(inventoryItems);
  } catch (error) {
    return handleRouteError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.name || !body.sku || !body.category || !body.unit) {
      return NextResponse.json(
        { error: 'Name, SKU, category, and unit are required' },
        { status: 400 }
      );
    }
    
    const newItem = await inventoryService.addItem(body);
    
    return NextResponse.json(newItem, { status: 201 });
  } catch (error) {
    return handleRouteError(error);
  }
}`;
    
    // Write the corrected content back to the file
    fs.writeFileSync(filePath, correctedContent, 'utf8');
    console.log(`Fixed inventory route file: ${filePath}`);
    
    return true;
  } catch (error) {
    console.error(`Error fixing inventory route file: ${error.message}`);
    return false;
  }
}

// Function to fix the menu route file
function fixMenuRouteFile() {
  const filePath = path.join(__dirname, '../src/app/api/menu/route.ts');
  
  try {
    // Read the file content
    console.log(`Reading file: ${filePath}`);
    const originalContent = fs.readFileSync(filePath, 'utf8');
    
    // Create a corrected version of the file
    const correctedContent = `import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import menuService from 'coffee-shop-ops/services/menuService';
import { MenuItem } from '@/types/models';
import { ApiError } from '@/utils/error-handler';
import { handleRouteError } from '../error';

// GET /api/menu - Get all menu items with optional filters
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    
    const category = searchParams.get('category') || undefined;
    const isAvailableStr = searchParams.get('available');
    // Convert string to boolean or keep as undefined
    const isAvailable = isAvailableStr === null ? undefined : isAvailableStr === 'true';

    const menuItems = await menuService.getItems({ category, isAvailable });
    return NextResponse.json(menuItems);
  } catch (error) {
    return handleRouteError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, price, category, description, image_url, is_available } = body as Partial<MenuItem>;

    if (!name || price === undefined || !category) {
      throw new ApiError('Name, price, and category are required', 400);
    }

    const newItem = await menuService.addItem({
      name,
      price,
      category,
      description,
      image_url,
      is_available,
    });

    return NextResponse.json(newItem, { status: 201 });
  } catch (error) {
    return handleRouteError(error);
  }
}`;
    
    // Write the corrected content back to the file
    fs.writeFileSync(filePath, correctedContent, 'utf8');
    console.log(`Fixed menu route file: ${filePath}`);
    
    return true;
  } catch (error) {
    console.error(`Error fixing menu route file: ${error.message}`);
    return false;
  }
}

// Function to check and fix all API route files
function checkAndFixAllRouteFiles() {
  // Start with fixing the inventory route file which we know has issues
  const inventoryFixed = fixInventoryRouteFile();
  
  if (inventoryFixed) {
    console.log('Successfully fixed inventory route file');
  } else {
    console.error('Failed to fix inventory route file');
  }
  
  // Fix the menu route file
  const menuFixed = fixMenuRouteFile();
  
  if (menuFixed) {
    console.log('Successfully fixed menu route file');
  } else {
    console.error('Failed to fix menu route file');
  }
}

// Execute the fix
checkAndFixAllRouteFiles();
