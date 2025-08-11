import { GET, POST } from '@/app/api/menu/route';
import { query } from '@/lib/db';
import { NextRequest } from 'next/server';
import menuService from 'coffee-shop-ops/services/menuService';

// Mock menuService
jest.mock('coffee-shop-ops/services/menuService', () => ({
  __esModule: true,
  default: {
    getAllItems: jest.fn(),
    addItem: jest.fn()
  }
}));

// Create a mock NextRequest constructor
const createMockNextRequest = (url: string, options: RequestInit = {}) => {
  const req = new Request(url, options);
  return Object.assign(req, {
    cookies: { get: jest.fn(), getAll: jest.fn(), has: jest.fn(), set: jest.fn(), delete: jest.fn() },
    nextUrl: new URL(url)
  }) as NextRequest;
};

// Mock the database query function
jest.mock('@/lib/db', () => ({
  query: jest.fn()
}));

const mockQuery = query as jest.MockedFunction<typeof query>;
const mockMenuService = menuService as jest.Mocked<typeof menuService>;

const toResponseShape = (item: any) => {
  const newItem = { ...item };
  for (const key in newItem) {
    if (newItem[key] instanceof Date) {
      newItem[key] = newItem[key].toISOString();
    }
  }
  return newItem;
};

describe('/api/menu', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET', () => {
    it('should get all menu items', async () => {
      const mockMenuItems = [
        { 
          id: '1', 
          name: 'Espresso', 
          price: 3.50, 
          category: 'Coffee', 
          is_available: true,
          created_at: new Date(),
          updated_at: new Date()
        },
        { 
          id: '2', 
          name: 'Latte', 
          price: 4.50, 
          category: 'Coffee', 
          is_available: true,
          created_at: new Date(),
          updated_at: new Date()
        }
      ];

      mockMenuService.getAllItems.mockResolvedValueOnce(mockMenuItems);

      const request = createMockNextRequest('http://localhost:3001/api/menu');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(Array.isArray(data.data)).toBe(true);
      expect(data.data).toHaveLength(2);
      expect(mockMenuService.getAllItems).toHaveBeenCalledWith({ category: undefined, isAvailable: false });
    });

    it('should filter menu items by category', async () => {
      const mockMenuItems = [
        { 
          id: '1', 
          name: 'Espresso', 
          price: 3.50, 
          category: 'Coffee', 
          is_available: true,
          created_at: new Date(),
          updated_at: new Date()
        }
      ];

      mockMenuService.getAllItems.mockResolvedValueOnce(mockMenuItems);

      const request = createMockNextRequest('http://localhost:3001/api/menu?category=Coffee');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(Array.isArray(data.data)).toBe(true);
      expect(data.data).toHaveLength(1);
      expect(mockMenuService.getAllItems).toHaveBeenCalledWith({ category: 'Coffee', isAvailable: false });
    });
  });

  describe('POST', () => {
    it('should create a new menu item', async () => {
      const newMenuItem = {
        id: 'new-id',
        name: 'New Coffee',
        price: 5.00,
        category: 'Coffee',
        description: 'A new coffee item',
        is_available: true,
        created_at: new Date(),
        updated_at: new Date()
      };

      mockMenuService.addItem.mockResolvedValueOnce(newMenuItem);

      const request = createMockNextRequest('http://localhost:3001/api/menu', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'New Coffee',
          price: 5.00,
          category: 'Coffee',
          description: 'A new coffee item'
        })
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data.success).toBe(true);
      expect(data.data.name).toBe('New Coffee');
      expect(data.data.category).toBe('Coffee');
      expect(mockMenuService.addItem).toHaveBeenCalledWith(expect.objectContaining({
        name: 'New Coffee',
        price: 5.00,
        category: 'Coffee',
        description: 'A new coffee item'
      }));
    });

    it('should return 400 for missing required fields', async () => {
      // Mock validation error
      mockMenuService.addItem.mockImplementationOnce(() => {
        const error = new Error('Missing required fields');
        error.name = 'ValidationError';
        throw error;
      });

      const request = createMockNextRequest('http://localhost:3001/api/menu', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'Test' }) // missing price and category
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBeTruthy();
    });
  });
});