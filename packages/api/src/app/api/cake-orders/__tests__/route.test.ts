import { POST } from '../route';
import { NextResponse } from 'next/server';

// Mock NextResponse.json
jest.mock('next/server', () => ({
  NextResponse: {
    json: jest.fn(),
  },
}));

describe('POST /api/cake-orders', () => {
  beforeEach(() => {
    (NextResponse.json as jest.Mock).mockClear();
  });

  it('should return a success message for a valid order', async () => {
    const mockOrder = {
      size: '8-inch',
      flavor: 'Chocolate',
      toppings: ['Sprinkles', 'Chocolate Chips'],
      message: 'Happy Birthday!',
    };

    const request = {
      json: async () => mockOrder,
    } as Request;

    await POST(request);

    expect(NextResponse.json).toHaveBeenCalledWith({
      message: 'Cake order submitted successfully',
      orderId: expect.any(String),
    });
  });

  it('should return a 400 error if required fields are missing', async () => {
    const mockOrder = {
      size: '8-inch',
      // Missing flavor
      toppings: ['Sprinkles'],
    };

    const request = {
      json: async () => mockOrder,
    } as Request;

    await POST(request);

    expect(NextResponse.json).toHaveBeenCalledWith(
      { error: 'Missing required fields' },
      { status: 400 }
    );
  });
});