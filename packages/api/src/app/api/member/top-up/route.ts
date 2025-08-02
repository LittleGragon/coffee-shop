import { NextResponse } from 'next/server';

// This is a mock balance. In a real app, this would be in a database.
let currentBalance = 50.75;

export async function POST(request: Request) {
  try {
    const { amount } = await request.json();

    if (typeof amount !== 'number' || amount <= 0) {
      return NextResponse.json(
        { error: 'Invalid top-up amount' },
        { status: 400 }
      );
    }

    console.log(`Processing top-up of $${amount}...`);

    // In a real application, you would update the user's balance in the database
    currentBalance += amount;

    return NextResponse.json({
      message: 'Top-up successful',
      newBalance: currentBalance,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid request body' },
      { status: 400 }
    );
  }
}