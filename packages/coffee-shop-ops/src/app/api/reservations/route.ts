import { NextRequest, NextResponse } from 'next/server';
import reservationService from '@/services/reservationService';
import { ApiError } from '@/utils/error-handler';
import { handleRouteError } from '../error';

// GET /api/reservations - Get all reservations
export async function GET(request: NextRequest) {
  try {
    // Parse query parameters
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status') || undefined;
    const date = searchParams.get('date') || undefined;
    
    const reservations = await reservationService.getAllReservations({ status, date });
    return NextResponse.json(reservations);
  } catch (error: unknown) {
    return handleRouteError(error);
  }
}

// POST /api/reservations - Create a new reservation
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.customer_name || !body.customer_phone || !body.party_size || !body.reservation_time) {
      return NextResponse.json(
        { error: 'Customer name, phone, party size, and reservation time are required' },
        { status: 400 }
      );
    }
    
    // Parse the reservation time
    const reservationTime = new Date(body.reservation_time);
    if (isNaN(reservationTime.getTime())) {
      return NextResponse.json(
        { error: 'Invalid reservation time format' },
        { status: 400 }
      );
    }
    
    // Check if the time slot is available
    const isAvailable = await reservationService.isTimeSlotAvailable(reservationTime, body.party_size);
    if (!isAvailable) {
      return NextResponse.json(
        { error: 'The requested time slot is not available. Please choose another time.' },
        { status: 409 }
      );
    }
    
    // Create the reservation
    const newReservation = await reservationService.createReservation({
      ...body,
      reservation_time: reservationTime
    });
    
    return NextResponse.json(newReservation, { status: 201 });
  } catch (error: unknown) {
    return handleRouteError(error);
  }
}