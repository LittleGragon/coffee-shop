import { GET, POST } from '../route';
import { NextRequest, NextResponse } from 'next/server';
import menuService from 'coffee-shop-ops/services/menuService';
import { MenuItem } from '@/types/models';

// Mock NextResponse.json
jest.mock('next/server', () => ({ 
  NextResponse: { 
    json: jest.fn() 
  }
}));

// Mock menuService
jest.mock('coffee-shop-ops/services/menuService', () => ({
  getAllItems: jest.fn(),
  createItem: jest.fn()
}));

describe('GET /api/menu', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return menu items', async () => {
    const mockItems = [
      { id: '1', name: 'Coffee', price: 3.99 },
      { id: '2', name: 'Tea', price: 2.99 }
    ];
    
    menuService.getAllItems.mockResolvedValue(mockItems);
    
    const request = new NextRequest('http://localhost:3000/api/menu');
    const response = await GET(request);
    
    expect(menuService.getAllItems).toHaveBeenCalled();
    expect(NextResponse.json).toHaveBeenCalledWith(mockItems);
  });
});

describe('POST /api/menu', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create a new menu item', async () => {
    const mockItem = { name: 'New Coffee', price: 4.99, category: 'coffee' };
    const mockCreatedItem = { id: '3', ...mockItem };
    
    menuService.createItem.mockResolvedValue(mockCreatedItem);
    
    const request = new NextRequest('http://localhost:3000/api/menu', {
      method: 'POST',
      body: JSON.stringify(mockItem)
    });
    
    const response = await POST(request);
    
    expect(menuService.createItem).toHaveBeenCalledWith(mockItem);
    expect(NextResponse.json).toHaveBeenCalledWith(mockCreatedItem);
  });
});