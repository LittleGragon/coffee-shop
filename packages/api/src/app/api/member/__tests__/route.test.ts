import { GET } from '../route';
import { NextResponse } from 'next/server';

// Mock NextResponse.json
jest.mock('next/server', () => ({
  NextResponse: {
    json: jest.fn(),
  },
}));

describe('GET /api/member', () => {
  beforeEach(() => {
    (NextResponse.json as jest.Mock).mockClear();
  });

  it('should return member data', async () => {
    await GET();

    expect(NextResponse.json).toHaveBeenCalledWith({
      name: 'Alex Doe',
      email: 'alex.doe@example.com',
      membershipLevel: 'Gold',
      points: 1250,
      balance: 75.5,
      orderHistory: expect.any(Array),
    });
  });
});