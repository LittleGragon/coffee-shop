import { NextRequest, NextResponse } from 'next/server';
import menuService from '@/services/menuService';
import { ApiError, handleApiError } from '@/utils/error-handler';

// GET /api/menu/[id] - Retrieve a menu item by ID
export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    if (!id) {
      throw new ApiError('Missing ID parameter', 400);
    }

    const menuItem = await menuService.getItemById(id);
    if (!menuItem) {
      throw new ApiError(`Menu item with ID ${id} not found`, 404);
    }

    return NextResponse.json({ success: true, data: menuItem });
  } catch (error) {
    return handleApiError(error);
  }
}

// PUT /api/menu/[id] - Update a menu item
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    if (!id) {
      throw new ApiError('Missing ID parameter', 400);
    }

    const body = await request.json();
    const updatedItem = await menuService.updateItem(id, body);

    return NextResponse.json({ success: true, data: updatedItem });
  } catch (error) {
    return handleApiError(error);
  }
}

// DELETE /api/menu/[id] - Remove a menu item
export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    if (!id) {
      throw new ApiError('Missing ID parameter', 400);
    }

    await menuService.deleteItem(id);
    return NextResponse.json({ success: true, message: 'Menu item deleted successfully' });
  } catch (error) {
    return handleApiError(error);
  }
}

// Support form-based DELETE via POST with _method=DELETE
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const formData = await request.formData();
    const method = formData.get('_method');

    if (method === 'DELETE') {
      const { id } = params;
      if (!id) {
        throw new ApiError('Missing ID parameter', 400);
      }
      await menuService.deleteItem(id);
      return NextResponse.json({ success: true, message: 'Menu item deleted successfully' });
    }

    throw new ApiError('Invalid method override', 400);
  } catch (error) {
    return handleApiError(error);
  }
}