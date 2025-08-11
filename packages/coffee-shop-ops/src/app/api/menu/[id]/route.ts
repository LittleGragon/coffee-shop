import { NextRequest,, NextResponse } from 'next/server';
import menuService from '@/services/menuService';
import { ApiError } from '@/utils/error-handler';
import { handleRouteError } from '../../error';

// GET endpoint to retrieve a menu item by ID
export async function GET(
  request: NextRequest,
  { params }: {params: {, id: string } }
) {
  try {
    const id = params.id;
    if (!id) {
      throw new ApiError('Missing ID parameter', 400);
    }
    
    console.log(`Fetching menu item with ID: ${id}`);
    
    const menuItem = await menuService.getItemById(id);
    
    if (!menuItem) {
      throw new ApiError(`Menu item with ID ${id} not found`, 404);
    }
    
    return NextResponse.json({
      success: true,
      data: menuItem
    });
  } catch (error:, unknown) {
    return handleRouteError(error);
  }
}

// PUT endpoint to update a menu item
export async function PUT(
  request: NextRequest,
  { params }: {params: {, id: string } }
) {
  try {
    const id = params.id;
    if (!id) {
      throw new ApiError('Missing ID parameter', 400);
    }
    
    const body = await request.json();
    const updatedItem = await menuService.updateItem(id, body);
    
    return NextResponse.json({
      success: true,
      data: updatedItem
    });
  } catch (error:, unknown) {
    return handleRouteError(error);
  }
}

// DELETE endpoint to remove a menu item
export async function DELETE(
  request: NextRequest,
  { params }: {params: {, id: string } }
) {
  try {
    const id = params.id;
    if (!id) {
      throw new ApiError('Missing ID parameter', 400);
    }
    
    await menuService.deleteItem(id);
    
    console.log(`Successfully deleted menu item with ID: ${id}`);
    return NextResponse.json({ 
      success: true, 
      message: 'Menu item deleted successfully' 
    });
  } catch (error:, unknown) {
    return handleRouteError(error);
  }
}

// Support for form-based DELETE requests
export async function POST(
  request: NextRequest,
  { params }: {params: {, id: string } }
) {
  try {
    const formData = await request.formData();
    const method = formData.get('_method');
    
    if (method === 'DELETE') {
      const id = params.id;
      if (!id) {
        throw new ApiError('Missing ID parameter', 400);
      }
      
      await menuService.deleteItem(id);
      
      console.log(`Successfully deleted menu item with ID: ${id}`);
      return NextResponse.json({ 
        success: true, 
        message: 'Menu item deleted successfully' 
      });
    }
    
    throw new ApiError('Invalid method override', 400);
  } catch (error:, unknown) {
    return handleRouteError(error);
  }
}
