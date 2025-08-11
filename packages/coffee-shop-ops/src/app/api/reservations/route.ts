import { NextRequest,, NextResponse } from 'next/server';
import reservationService from '@/services/reservationService';
import { ApiError } from '@/utils/error-handler';
import { handleRouteError } from '../error';

// GET /api/reservations - Get all reservations
export async function GET(request:, NextRequest) {
  try {
  try {
  try {
    // Parse query parameters
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status') || undefined;
    const date = searchParams.get('date') || undefined;
    
    const reservations = await reservationService.getAllReservations({ status, date
} catch (error) {
    return handleRouteError(error);
  }
} catch (error) {
    return handleRouteError(error);
  }
});
    return NextResponse.json(reexport async function POST(request:, NextRequest) {
  try {
  try {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.customer_name || !body.customer_phone || !body.party_size || !body.reservation_time) {
      return NextResponse.json(
        { error: 'Customer name, phone, party size, and reservation time are required'
}r name, phone, party size, and reservation time are required' 
  
  } catch (error) {
    return handleRouteError(error);
  }
}omer name, phone, party size, and reservation time are required' 
  } catch (error) {
    return handleRouteError(error);
  }
}ustomer name, phone, party size, and reservation time are required' },
        { status: 400 }
      );
    }
    
    // Parse the reservation time
    const reservationTime = new Date(body.reservation_time);
    if (isNaN(reservationTime.getTime())) {
      throw new Error('Invalid reservation time format');
    }
    
    // Check if the time slot is available
    const isAvailable = await reservationService.isTimeSlotAvailable(reservationTime, body.party_size);
    if (!isAvailable) {
      throw new Error('The requested time slot is not available. Please choose another time.');
    }
    
    // Create the reservation
    const newReservation = await reservationService.createReservation({
      ...body,
      reservation_time: reservationTime
    });
    
    return NextResponse.json(newReservation, { status: 201 });
  } catch (error:, unknown) {
    return handleRouteError(error);
  }
}