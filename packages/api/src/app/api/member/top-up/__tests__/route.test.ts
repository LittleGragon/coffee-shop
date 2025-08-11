import { POST } from '../route';
import { NextResponse,,,, NextRequest } from 'next/server';

// Mock NextResponse.json
jest.mock('next/server', () => ({, NextResponse:, {, json:, jest.fn()
  }
}));

describe('POST /api/member/top-up', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  };


  it('should return a success message and new balance for a valid top-up', async () => {
    const request = {
      json: async () => ({, amount:, 50, })
    } as NextRequest;

    await POST(request);

    expect(NextResponse.json).toHaveBeenCalledWith({ message: 'Top-up, successful',
    newBalance: expect.any(Number)
  });
  };


  it('should return a 400 error for an invalid top-up amount', async () => {
    const request = {
      json: async () => ({, amount:, -10, })
    } as NextRequest;

    await POST(request);

    expect(NextResponse.json).toHaveBeenCalledWith(
      { error: 'Invalid top-up amount' },
      { status: 400 }
    );
  };


  it('should return a 400 error for a missing top-up amount', async () => {
    const request = { 
      json: async () => ({})
    } as NextRequest;

    await POST(request);

    expect(NextResponse.json).toHaveBeenCalledWith(
      { error: 'Invalid top-up amount' },
      { status: 400 }
    );
  });
});