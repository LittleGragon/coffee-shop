import { NextRequest, NextResponse } from 'next/server';
import reservationService from '@/services/reservationService';

// GET /api/reservations/[id] - Get a specific reservation
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const reservation = await reservationService.getReservationById(id);
    
    if (!reservation) {
      return NextResponse.json(
        { error: `Reservation with ID ${id} not found` },
        { status: 404 }
      );
    }
    
    return NextResponse.json(reservation);
  } catch (error) {
    // console.error(`Error fetching reservation ${params.id}:`, error);
    return NextResponse.json(
      { error: 'Failed to fetch reservation' },
      { status: 500 }
    );
  }
}

// PUT /api/reservations/[id] - Update a reservation
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const updates = await request.json();
    
    // If updating reservation time, parse it
    if (updates.reservation_time) {
      const reservationTime = new Date(updates.reservation_time);
      if (isNaN(reservationTime.getTime())) {
        return NextResponse.json(
          { error: 'Invalid reservation time format' },
          { status: 400 }
        );
      }
      
      // If updating party size or time, check availability
      if (updates.party_size || updates.reservation_time) {
        // Get current reservation to get the current party size if not updating
        const currentReservation = await reservationService.getReservationById(id);
        if (!currentReservation) {
          return NextResponse.json(
            { error: `Reservation with ID ${id} not found` },
            { status: 404 }
          );
        }
        
        const partySize = updates.party_size || currentReservation.party_size;
        const time = updates.reservation_time ? reservationTime : currentReservation.reservation_time;
        
        const isAvailable = await reservationService.isTimeSlotAvailable(time, partySize);
        if (!isAvailable) {
          return NextResponse.json(
            { error: 'The requested time slot is not available. Please choose another time.' },
            { status: 409 }
          );
        }
      }
      
      updates.reservation_time = reservationTime;
    }
    
    const updatedReservation = await reservationService.updateReservation(id, updates);
    
    if (!updatedReservation) {
      return NextResponse.json(
        { error: `Reservation with ID ${id} not found` },
        { status: 404 }
      );
    }
    
    return NextResponse.json(updatedReservation);
  } catch (error) {
    // console.error(`Error updating reservation ${params.id}:`, error);
    return NextResponse.json(
      { error: 'Failed to update reservation' },
      { status: 500 }
    );
  }
}

// PATCH /api/reservations/[id] - Update reservation status
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const { status } = await request.json();
    
    if (!status) {
      return NextResponse.json(
        { error: 'Status is required' },
        { status: 400 }
      );
    }
    
    // Validate status
    const validStatuses = ['confirmed', 'cancelled', 'completed', 'no-show'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` },
        { status: 400 }
      );
    }
    
    const updatedReservation = await reservationService.updateReservationStatus(id, status);
    
    if (!updatedReservation) {
      return NextResponse.json(
        { error: `Reservation with ID ${id} not found` },
        { status: 404 }
      );
    }
    
    return NextResponse.json(updatedReservation);
  } catch (error) {
    // console.error(`Error updating reservation status ${params.id}:`, error);
    return NextResponse.json(
      { error: 'Failed to update reservation status' },
      { status: 500 }
    );
  }
}

// DELETE /api/reservations/[id] - Delete a reservation
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const success = await reservationService.deleteReservation(id);
    
    if (!success) {
      return NextResponse.json(
        { error: `Reservation with ID ${id} not found` },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true, message: 'Reservation deleted successfully' });
  } catch (error) {
    // console.error(`Error deleting reservation ${params.id}:`, error);
    return NextResponse.json(
      { error: 'Failed to delete reservation' },
      { status: 500 }
    );
  }
}