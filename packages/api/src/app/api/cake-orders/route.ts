import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { size, flavor, toppings } = body;

    // Basic validation
    if (!size || !flavor || !toppings) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    console.log('Submitting cake order:', body);

    // In a real application, you would save this to a database
    const orderId = `cake-${Date.now()}`;

    return NextResponse.json({
      message: 'Cake order submitted successfully',
      orderId,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid request body' },
      { status: 400 }
    );
  }
}
