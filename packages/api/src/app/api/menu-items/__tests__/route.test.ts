import { GET } from '../route';
import { NextResponse } from 'next/server';

// Mock NextResponse
jest.mock('next/server', () => ({
  NextResponse: {
    json: jest.fn((data, options) => ({
      ...options,
      json: () => Promise.resolve(data),
    })),
  },
}));

describe('GET /api/menu-items', () => {
  beforeEach(() => {
    // Clear mock history before each test
    (NextResponse.json as jest.Mock).mockClear();
  });

  it('should return menu items for a valid category', async () => {
    const request = {
      url: 'http://localhost/api/menu-items?category=coffee',
    } as Request;
    const response = await GET(request);
    const json = await response.json();

    expect(NextResponse.json).toHaveBeenCalledWith({
      data: expect.any(Array),
    });
    expect(json.data.length).toBeGreaterThan(0);
  });

  it('should return a 400 error for an invalid category', async () => {
    const request = {
      url: 'http://localhost/api/menu-items?category=invalid',
    } as Request;
    await GET(request);

    expect(NextResponse.json).toHaveBeenCalledWith(
      { error: 'Invalid or missing category' },
      { status: 400 }
    );
  });

  it('should return a 400 error for a missing category', async () => {
    const request = { url: 'http://localhost/api/menu-items' } as Request;
    await GET(request);

    expect(NextResponse.json).toHaveBeenCalledWith(
      { error: 'Invalid or missing category' },
      { status: 400 }
    );
  });
});
