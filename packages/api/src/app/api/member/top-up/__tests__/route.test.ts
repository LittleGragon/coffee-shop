import { POST } from '../route';
import { NextResponse } from 'next/server';
import { handleRouteError } from "../../../error";

// Mock NextResponse.json
jest.mock('next/server', () => ({
  NextResponse: {
    json: jest.fn(),
  },
}));

describe('POST /api/member/top-up', () => {
  beforeEach(() => {
    (NextResponse.json as jest.Mock).mockClear();
  });

  it('should return a success message and new balance for a valid top-up', async () => {
    const request = {
      json: async () => ({ amount: 50 }),
    } as Request;

    await POST(request);

    expect(NextResponse.json).toHaveBeenCalledWith({
      message: 'Top-up successful',
      newBalance: expect.any(Number),
    });
  });

  it('should return a 400 error for an invalid top-up amount', async () => {
    const request = {
      json: async () => ({ amount: -10 }),
    } as Request;

    await POST(request);

    expect(NextResponse.json).toHaveBeenCalledWith(
      { error: 'Invalid top-up amount' },
      { status: 400 }
    );
  });

  it('should return a 400 error for a missing top-up amount', async () => {
    const request = {
      json: async () => ({}),
    } as Request;

    await POST(request);

    expect(NextResponse.json).toHaveBeenCalledWith(
      { error: 'Invalid top-up amount' },
      { status: 400 }
    );
  });
});