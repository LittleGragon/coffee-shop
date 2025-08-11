import { GET, POST } from '../route';
import { NextRequest, NextResponse } from 'next/server';
import menuService from 'coffee-shop-ops/services/menuService';

// Create a mock NextRequest constructor
const createMockNextRequest = (url: string, options: RequestInit = {}) => {
  const req = new Request(url, options);
  return Object.assign(req, {
    cookies: { get: jest.fn(), getAll: jest.fn(), has: jest.fn(), set: jest.fn(), delete: jest.fn() },
    nextUrl: new URL(url)
  }) as NextRequest;
};

// Mock NextResponse.json
jest.mock('next/server', () => ({
  NextResponse: {
    json: jest.fn()
  }
}));

// Mock menuService
jest.mock('coffee-shop-ops/services/menuService', () => ({
  __esModule: true,
  default: {
    getAllItems: jest.fn(),
    getItemById: jest.fn(),
    updateItem: jest.fn(),
    deleteItem: jest.fn(),
    addItem: jest.fn()
  }
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

    (menuService.getAllItems as jest.Mock).mockResolvedValue(mockItems);

    const request = createMockNextRequest('http://localhost:3000/api/menu');
    
    const response = await GET(request);

    expect(menuService.getAllItems).toHaveBeenCalled();
    expect(NextResponse.json).toHaveBeenCalledWith({
      success: true,
      data: mockItems,
    });
  });
});

describe('POST /api/menu', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create a new menu item', async () => {
    const mockItem = { name: 'New Coffee', price: 4.99, category: 'coffee' };
    const mockCreatedItem = { id: '3', ...mockItem };

    // Mock the addItem method
    (menuService.addItem as jest.Mock).mockResolvedValue(mockCreatedItem);

    const request = createMockNextRequest('http://localhost:3000/api/menu', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(mockItem)
    });

    const response = await POST(request);

    expect(menuService.addItem).toHaveBeenCalledWith(mockItem);
    expect(NextResponse.json).toHaveBeenCalledWith({
      success: true,
      data: mockCreatedItem,
    }, { status: 201 });
  });
});