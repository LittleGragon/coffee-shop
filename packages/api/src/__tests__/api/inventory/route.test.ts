import { GET, POST } from '@/app/api/inventory/route';
import { query } from '@/lib/db';
import { NextRequest } from 'next/server';
import inventoryService from 'coffee-shop-ops/services/inventoryService';

// Mock inventoryService
jest.mock('coffee-shop-ops/services/inventoryService', () => ({
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
const mockInventoryService = inventoryService as jest.Mocked<typeof inventoryService>;

const toResponseShape = (item: any) => {
  const newItem = { ...item };
  for (const key in newItem) {
    if (newItem[key] instanceof Date) {
      newItem[key] = newItem[key].toISOString();
    }
  }
  return newItem;
};

describe('/api/inventory', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET', () => {
    it('should get all inventory items', async () => {
      const mockInventoryItems = [
        { 
          id: '1', 
          name: 'Coffee Beans', 
          sku: 'CB001',
          category: 'Beans',
          current_stock: 50, 
          minimum_stock: 10,
          cost_per_unit: 15.99,
          unit: 'kg',
          description: 'Premium coffee beans',
          created_at: new Date(),
          updated_at: new Date()
        },
        { 
          id: '2', 
          name: 'Milk', 
          sku: 'MK001',
          category: 'Dairy',
          current_stock: 100, 
          minimum_stock: 20,
          cost_per_unit: 2.99,
          unit: 'liter',
          description: 'Fresh milk',
          created_at: new Date(),
          updated_at: new Date()
        }
      ];

      mockInventoryService.getAllItems.mockResolvedValueOnce(mockInventoryItems);

      const request = createMockNextRequest('http://localhost:3001/api/inventory');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(Array.isArray(data.data)).toBe(true);
      expect(data.data).toHaveLength(2);
      expect(mockInventoryService.getAllItems).toHaveBeenCalledWith({ category: undefined });
    });

    it('should get inventory item by id', async () => {
      const mockInventoryItem = {
        id: '1',
        name: 'Coffee Beans',
        sku: 'CB001',
        category: 'Beans',
        current_stock: 50,
        minimum_stock: 10,
        cost_per_unit: 15.99,
        unit: 'kg',
        description: 'Premium coffee beans',
        created_at: new Date(),
        updated_at: new Date()
      };

      mockInventoryService.getAllItems.mockResolvedValueOnce([mockInventoryItem]);

      const request = createMockNextRequest('http://localhost:3001/api/inventory?id=1');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data[0].name).toBe('Coffee Beans');
      expect(mockInventoryService.getAllItems).toHaveBeenCalledWith({ category: undefined });
    });
  });

  describe('POST', () => {
    it('should create a new inventory item', async () => {
      const newInventoryItem = {
        id: 'new-id',
        name: 'Sugar',
        sku: 'SG001',
        category: 'Sweeteners',
        current_stock: 25,
        minimum_stock: 5,
        cost_per_unit: 1.99,
        unit: 'kg',
        description: 'White sugar',
        created_at: new Date(),
        updated_at: new Date()
      };

      mockInventoryService.addItem.mockResolvedValueOnce(newInventoryItem);

      const request = createMockNextRequest('http://localhost:3001/api/inventory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Sugar',
          quantity: 25,
          unit: 'kg',
          reorder_level: 5
        })
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data.success).toBe(true);
      expect(data.data.name).toBe('Sugar');
      expect(data.data.current_stock).toBe(25);
      expect(mockInventoryService.addItem).toHaveBeenCalledWith(expect.objectContaining({
        name: 'Sugar',
        quantity: 25,
        unit: 'kg',
        reorder_level: 5
      }));
    });

    it('should return 400 for missing required fields', async () => {
      // Mock validation error
      mockInventoryService.addItem.mockImplementationOnce(() => {
        const error = new Error('Missing required fields');
        error.name = 'ValidationError';
        throw error;
      });
      
      const request = createMockNextRequest('http://localhost:3001/api/inventory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'Test' }) // missing quantity and unit
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBeTruthy();
    });
  });
});