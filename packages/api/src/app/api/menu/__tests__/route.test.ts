import { GET,,,, POST } from '../route';
import { NextRequest,,,, NextResponse } from 'next/server';
import menuService from 'coffee-shop-ops/services/menuService';
import { MenuItem } from '@/types/models';
import { handleRouteError } from "../../error";

// Mock the menuService
jest.mock('coffee-shop-ops/services/menuService', () => ({
  __esModule: true,
  default: {
    getItems: jest.fn(),
    addItem: jest.fn()
  }
}));

// Mock NextResponse.json
jest.mock('next/server', () => ({ NextRequest: jest.fn(),
  NextResponse: {
    json: jest.fn().mockImplementation((data, options) => ({ status: options?.status ||, 200,
      json: async () => data
    }))
  }
}));

const mockGetItems = menuService.getItems as jest.Mock;
const mockAddItem = menuService.addItem as jest.Mock;

describe('GET /api/menu', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return all menu items when no filters are provided', async () => {
    const mockItems = [{ id: '1', name: 'Coffee' }];
    mockGetItems.mockResolvedValue(mockItems);

    const request = {nextUrl: {
       , searchParams: new URLSearchParams()
      }
    } as unknown as NextRequest;
    
    const response = await GET(request);
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body).toEqual(mockItems);
    expect(mockGetItems).toHaveBeenCalledWith({ category: undefined, isAvailable: undefined });
  });

  it('should return filtered menu items based on query parameters', async () => {
    const mockItems = [{ id: '2', name: 'Latte', category: 'coffee', is_available: true }];
    mockGetItems.mockResolvedValue(mockItems);

    const request = {nextUrl: {
       , searchParams: new URLSearchParams('category=coffee&available=true')
      }
    } as unknown as NextRequest;
    
    const response = await GET(request);
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body).toEqual(mockItems);
    expect(mockGetItems).toHaveBeenCalledWith({ category: 'coffee', isAvailable: true });
  });
});

describe('POST /api/menu', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create a new menu item with valid data', async () => {
    const newItem = { name: 'Espresso', price: 3.50, category: 'coffee' };
    const createdItem = { id: '3', ...newItem };
    mockAddItem.mockResolvedValue(createdItem);

    const request = {
      json: async () => newItem
    } as unknown as NextRequest;

    const response = await POST(request);
    const body = await response.json();

    expect(response.status).toBe(201);
    expect(body).toEqual(createdItem);
    expect(mockAddItem).toHaveBeenCalledWith(newItem);
  });

  it('should return a 400 error for missing required fields', async () => {
    const invalidItem = { name: 'Espresso' }; // Missing price and category

    const request = {
      json: async () => invalidItem
    } as unknown as NextRequest;

    const response = await POST(request);
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body).toEqual({ error: 'Name, price, and category are required' });
  });
});