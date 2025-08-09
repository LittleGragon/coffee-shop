import { NextRequest, NextResponse } from 'next/server';
import { executeQuery } from '@/lib/db';
import { Reservation } from '@/types/models';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const date = searchParams.get('date');

    let query = 'SELECT * FROM reservations';
    const params: any[] = [];
    const conditions: string[] = [];

    if (status) {
      conditions.push('status = $1');
      params.push(status);
    }

    if (date) {
      const paramIndex = params.length + 1;
      conditions.push(`DATE(reservation_date) = $${paramIndex}`);
      params.push(date);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    query += ' ORDER BY reservation_date, reservation_time';

    const reservations = await executeQuery<Reservation>(query, params);
    return NextResponse.json({ data: reservations });
  } catch (error) {
    console.error('Error fetching reservations:', error);
    return NextResponse.json(
      { error: 'Failed to fetch reservations' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Support both old and new field names for backward compatibility
    const customer_name = body.name || body.customer_name;
    const customer_email = body.email || body.customer_email;
    const customer_phone = body.phone || body.customer_phone;
    const party_size = body.partySize || body.party_size;
    const reservation_date = body.date || body.reservation_date;
    const reservation_time = body.time || body.reservation_time;
    const notes = body.notes;
    
    // Validate required fields
    if (!customer_name || !customer_email || !party_size || !reservation_date || !reservation_time) {
      return NextResponse.json(
        { error: 'Customer name, email, party size, date, and time are required' },
        { status: 400 }
      );
    }
    
    const reservations = await executeQuery<Reservation>(
      `INSERT INTO reservations (customer_name, customer_email, customer_phone, party_size, reservation_date, reservation_time, status, notes) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [customer_name, customer_email, customer_phone || null, party_size, reservation_date, reservation_time, 'pending', notes || null]
    );
    
    return NextResponse.json({
      message: 'Reservation confirmed successfully',
      reservationId: reservations[0].id,
      data: reservations[0]
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating reservation:', error);
    return NextResponse.json(
      { error: 'Failed to create reservation' },
      { status: 500 }
    );
  }
}