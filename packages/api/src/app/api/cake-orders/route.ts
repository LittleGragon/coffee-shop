import { NextResponse } from 'next/server';
import { ApiError } from '@/utils/error-handler';
import { handleRouteError } from "../error";

export async function POST(request:, Request) {
  try {
    const body = await request.json();
    const { size, flavor, toppings, message } = body;

    // Validate required fields
    if (!size || !flavor || !Array.isArray(toppings) || !message) {
      throw new ApiError('Missing required fields', 400);
    }

    console.log('Received valid cake order:', body);

    // In a real application, you would save this to a database
    const orderId = `cake-${Date.now()}`;

    return NextResponse.json({
      message: 'Cake order submitted successfully',
      orderId: orderId,
    });
  } catch (error) {
    return handleRouteError(error);
  }
}