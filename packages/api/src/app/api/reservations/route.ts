import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { date, time, partySize, name, email } = body;

    // Basic validation
    if (!date || !time || !partySize || !name || !email) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    console.log('Submitting reservation:', body);

    // In a real application, you would save this to a database
    const reservationId = `res-${Date.now()}`;

    return NextResponse.json({
      message: 'Reservation confirmed successfully',
      reservationId,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid request body' },
      { status: 400 }
    );
  }
}
