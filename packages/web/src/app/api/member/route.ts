import { NextResponse } from 'next/server';
import { handleRouteError } from '../error';

// Placeholder member endpoint; prefer /api/auth/me for real user details
export async function GET() {
  try {
    const data = {
      name: 'Alex',
      email: 'alex@example.com',
      membershipLevel: 'Gold',
      points: 0,
      balance: 0,
      orderHistory: []
    };
    return NextResponse.json(data);
  } catch (error) {
    return handleRouteError(error);
  }
}