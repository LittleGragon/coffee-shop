import { GET, POST } from '../route';
import { NextRequest } from 'next/server';
import menuService from 'coffee-shop-ops/services/menuService';
import { MenuItem } from '@/types/models';
import { handleRouteError } from "../../error";

// Mock the menuService
jest.mock('coffee-shop-ops/services/menuService', () => ({
  __esModule: true,
  default: {
    getAllItems: jest.fn(),
    addItem: jest.fn(),
  },
}));

const mockGetAllItems = menuService.getAllItems as jest.Mock;
const mockAddItem = menuService.addItem as jest.Mock;

describe('GET /api/menu', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return all menu items when no filters are provided', async () => {
    const mockItems: Partial<MenuItem>[] = [{ id: '1', name: 'Coffee' }];
    mockGetAllItems.mockResolvedValue(mockItems);

    const request = new NextRequest('http://localhost/api/menu');
    const response = await GET(request);
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body).toEqual(mockItems);
    expect(mockGetAllItems).toHaveBeenCalledWith({ category: undefined, isAvailable: undefined });
  });

  it('should return filtered menu items based on query parameters', async () => {
    const mockItems: Partial<MenuItem>[] = [{ id: '2', name: 'Latte', category: 'coffee', is_available: true }];
    mockGetAllItems.mockResolvedValue(mockItems);

    const request = new NextRequest('http://localhost/api/menu?category=coffee&available=true');
    const response = await GET(request);
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body).toEqual(mockItems);
    expect(mockGetAllItems).toHaveBeenCalledWith({ category: 'coffee', isAvailable: true });
  });

  it('should return a 500 error if the service fails', async () => {
    mockGetAllItems.mockRejectedValue(new Error('Service failed'));

    const request = new NextRequest('http://localhost/api/menu');
    const response = await GET(request);
    const body = await response.json();

    expect(response.status).toBe(500);
    expect(body).toEqual({ error: 'Failed to fetch menu items' });
  });
});

describe('POST /api/menu', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create a new menu item with valid data', async () => {
    const newItem: Partial<MenuItem> = { name: 'Espresso', price: 3.50, category: 'coffee' };
    const createdItem = { id: '3', ...newItem };
    mockAddItem.mockResolvedValue(createdItem);

    const request = new NextRequest('http://localhost/api/menu', {
      method: 'POST',
      body: JSON.stringify(newItem),
    });
    const response = await POST(request);
    const body = await response.json();

    expect(response.status).toBe(201);
    expect(body).toEqual(createdItem);
    expect(mockAddItem).toHaveBeenCalledWith(newItem);
  });

  it('should return a 400 error for missing required fields', async () => {
    const invalidItem = { name: 'Espresso' }; // Missing price and category

    const request = new NextRequest('http://localhost/api/menu', {
      method: 'POST',
      body: JSON.stringify(invalidItem),
    });
    const response = await POST(request);
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body).toEqual({ error: 'Name, price, and category are required' });
  });

  it('should return a 500 error if the service fails to create an item', async () => {
    const newItem: Partial<MenuItem> = { name: 'Espresso', price: 3.50, category: 'coffee' };
    mockAddItem.mockRejectedValue(new Error('Service failed'));

    const request = new NextRequest('http://localhost/api/menu', {
      method: 'POST',
      body: JSON.stringify(newItem),
    });
    const response = await POST(request);
    const body = await response.json();

    expect(response.status).toBe(500);
    expect(body).toEqual({ error: 'Failed to create menu item' });
  });
});