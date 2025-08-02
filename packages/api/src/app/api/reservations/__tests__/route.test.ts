import { POST } from '../route';
import { NextResponse } from 'next/server';

// Mock NextResponse.json
jest.mock('next/server', () => ({
  NextResponse: {
    json: jest.fn(),
  },
}));

describe('POST /api/reservations', () => {
  beforeEach(() => {
    (NextResponse.json as jest.Mock).mockClear();
  });

  it('should return a success message for a valid reservation', async () => {
    const mockReservation = {
      date: '2024-12-25',
      time: '19:00',
      partySize: 4,
      name: 'John Doe',
      email: 'john.doe@example.com',
    };

    const request = {
      json: async () => mockReservation,
    } as Request;

    await POST(request);

    expect(NextResponse.json).toHaveBeenCalledWith({
      message: 'Reservation confirmed successfully',
      reservationId: expect.any(String),
    });
  });

  it('should return a 400 error if required fields are missing', async () => {
    const mockReservation = {
      date: '2024-12-25',
      // Missing time
      partySize: 4,
      name: 'John Doe',
    };

    const request = {
      json: async () => mockReservation,
    } as Request;

    await POST(request);

    expect(NextResponse.json).toHaveBeenCalledWith(
      { error: 'Missing required fields' },
      { status: 400 }
    );
  });
});