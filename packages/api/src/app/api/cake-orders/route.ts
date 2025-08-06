import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { size, flavor, toppings, message, price } = body;

    // More robust validation
    if (
      !size || typeof size !== 'object' ||
      !flavor || typeof flavor !== 'object' ||
      !Array.isArray(toppings) ||
      typeof message !== 'string' ||
      typeof price !== 'number'
    ) {
      return NextResponse.json(
        { message: 'Invalid cake order data. Please check your selections.' },
        { status: 400 }
      );
    }

    console.log('Received valid cake order:', body);

    // In a real application, you would save this to a database
    const orderId = `cake-${Date.now()}`;

    return NextResponse.json({
      success: true,
      message: 'Cake order submitted successfully!',
      orderId: orderId,
      cakeDetails: body,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid request body' },
      { status: 400 }
    );
  }
}
