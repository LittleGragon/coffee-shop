import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { ApiError, handleRouteError } from '@/lib/api-error';

// NOTE:
// This endpoint uses the "members" table. Ensure it exists in your DB.
// If your project only uses "users", consider migrating this route to use public.users instead.

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;

    const email = searchParams.get('email');
    const memberId = searchParams.get('id');

    if (email) {
      // Get member by email
      const result = await query<any>(
        'SELECT * FROM members WHERE email = $1',
        [email]
      );

      if (!result || result.length === 0) {
        throw new ApiError('Member not found', 404);
      }

      const member = result[0];
      return NextResponse.json({
        id: member.id,
        name: member.name,
        email: member.email,
        phone: member.phone,
        membership_level: member.membership_level,
        points: member.points,
        balance: parseFloat(member.balance),
        member_since: member.member_since,
        created_at: member.created_at,
        updated_at: member.updated_at
      });
    }

    if (memberId) {
      // Get member by ID
      const result = await query<any>(
        'SELECT * FROM members WHERE id = $1',
        [memberId]
      );

      if (!result || result.length === 0) {
        throw new ApiError('Member not found', 404);
      }

      const member = result[0];
      return NextResponse.json({
        id: member.id,
        name: member.name,
        email: member.email,
        phone: member.phone,
        membership_level: member.membership_level,
        points: member.points,
        balance: parseFloat(member.balance),
        member_since: member.member_since,
        created_at: member.created_at,
        updated_at: member.updated_at
      });
    }

    // Get all members
    const result = await query<any>('SELECT * FROM members ORDER BY created_at DESC');
    const members = (result || []).map((member: any) => ({
      id: member.id,
      name: member.name,
      email: member.email,
      phone: member.phone,
      membership_level: member.membership_level,
      points: member.points,
      balance: parseFloat(member.balance),
      member_since: member.member_since,
      created_at: member.created_at,
      updated_at: member.updated_at
    }));

    return NextResponse.json(members);
  } catch (error) {
    return handleRouteError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, membership_level = 'Bronze' } = body || {};

    if (!name || !email) {
      throw new ApiError('Name and email are required', 400);
    }

    const result = await query<any>(
      `INSERT INTO members (name, email, phone, membership_level) 
       VALUES ($1, $2, $3, $4) 
       RETURNING *`,
      [name, email, phone, membership_level]
    );

    const member = result?.[0];
    return NextResponse.json(
      {
        id: member.id,
        name: member.name,
        email: member.email,
        phone: member.phone,
        membership_level: member.membership_level,
        points: member.points,
        balance: parseFloat(member.balance),
        member_since: member.member_since,
        created_at: member.created_at,
        updated_at: member.updated_at
      },
      { status: 201 }
    );
  } catch (error) {
    return handleRouteError(error);
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, name, email, phone, membership_level } = body || {};

    if (!id) {
      throw new ApiError('Member ID is required', 400);
    }

    const result = await query<any>(
      `UPDATE members 
       SET name = COALESCE($2, name), 
           email = COALESCE($3, email), 
           phone = COALESCE($4, phone), 
           membership_level = COALESCE($5, membership_level),
           updated_at = CURRENT_TIMESTAMP 
       WHERE id = $1 
       RETURNING *`,
      [id, name, email, phone, membership_level]
    );

    if (!result || result.length === 0) {
      throw new ApiError('Member not found', 404);
    }

    const member = result[0];
    return NextResponse.json({
      id: member.id,
      name: member.name,
      email: member.email,
      phone: member.phone,
      membership_level: member.membership_level,
      points: member.points,
      balance: parseFloat(member.balance),
      member_since: member.member_since,
      created_at: member.created_at,
      updated_at: member.updated_at
    });
  } catch (error: unknown) {
    return handleRouteError(error);
  }
}