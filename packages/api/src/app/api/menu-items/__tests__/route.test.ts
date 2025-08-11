import { GET } from '../route';
import { NextRequest, NextResponse } from 'next/server';
import { handleRouteError } from "../../error";

// Create a mock NextRequest constructor
const createMockNextRequest = (url: string, options: RequestInit = {}) => {
  const req = new Request(url, options);
  return Object.assign(req, {
    cookies: { get: jest.fn(), getAll: jest.fn(), has: jest.fn(), set: jest.fn(), delete: jest.fn() },
    nextUrl: new URL(url)
  }) as NextRequest;
};

// Mock NextResponse.redirect
jest.mock('next/server', () => {
  const originalModule = jest.requireActual('next/server');
  return {
    ...originalModule,
    NextResponse: {
      ...originalModule.NextResponse,
      redirect: jest.fn().mockImplementation((url) => {
        return {
          status: 307,
          headers: {
            get: () => url
          },
          url
        };
      })
    }
  };
});

describe('GET /api/menu-items', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should redirect to /api/menu with no query parameters', async () => {
    const request = createMockNextRequest('http://localhost/api/menu-items');
    const response = await GET(request);
    expect(response.status).toBe(307);
    expect(response.headers.get('location')).toBe('http://localhost/api/menu');
  });

  it('should redirect to /api/menu with category parameter', async () => {
    const request = createMockNextRequest('http://localhost/api/menu-items?category=Coffee');
    const response = await GET(request);
    expect(response.status).toBe(307);
    expect(response.headers.get('location')).toBe('http://localhost/api/menu?category=Coffee');
  });

  it('should redirect to /api/menu with available parameter', async () => {
    const request = createMockNextRequest('http://localhost/api/menu-items?available=true');
    const response = await GET(request);
    expect(response.status).toBe(307);
    expect(response.headers.get('location')).toBe('http://localhost/api/menu?available=true');
  });

  it('should redirect to /api/menu with multiple parameters', async () => {
    const request = createMockNextRequest('http://localhost/api/menu-items?category=Coffee&available=true');
    const response = await GET(request);
    expect(response.status).toBe(307);
    expect(response.headers.get('location')).toBe('http://localhost/api/menu?category=Coffee&available=true');
  });
});