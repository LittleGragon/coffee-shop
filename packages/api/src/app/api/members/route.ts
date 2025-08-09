import { NextRequest, NextResponse } from 'next/server';
import { query } from '../../../lib/db';
import { Member } from '../../../types/models';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');
    const memberId = searchParams.get('id');

    if (email) {
      // Get member by email
      const result = await query(
        'SELECT * FROM members WHERE email = $1',
        [email]
      );
      
      if (result.rows.length === 0) {
        return NextResponse.json({ error: 'Member not found' }, { status: 404 });
      }

      const member = result.rows[0];
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
      const result = await query(
        'SELECT * FROM members WHERE id = $1',
        [memberId]
      );
      
      if (result.rows.length === 0) {
        return NextResponse.json({ error: 'Member not found' }, { status: 404 });
      }

      const member = result.rows[0];
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
    const result = await query('SELECT * FROM members ORDER BY created_at DESC');
    const members = result.rows.map(member => ({
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
    // console.error('Error fetching members:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, membership_level = 'Bronze' } = body;

    if (!name || !email) {
      return NextResponse.json({ error: 'Name and email are required' }, { status: 400 });
    }

    const result = await query(
      `INSERT INTO members (name, email, phone, membership_level) 
       VALUES ($1, $2, $3, $4) 
       RETURNING *`,
      [name, email, phone, membership_level]
    );

    const member = result.rows[0];
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
    }, { status: 201 });
  } catch (error) {
    // console.error('Error creating member:', error);
    if (error.code === '23505') { // Unique constraint violation
      return NextResponse.json({ error: 'Email already exists' }, { status: 409 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, name, email, phone, membership_level } = body;

    if (!id) {
      return NextResponse.json({ error: 'Member ID is required' }, { status: 400 });
    }

    const result = await query(
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

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Member not found' }, { status: 404 });
    }

    const member = result.rows[0];
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
  } catch (error) {
    // console.error('Error updating member:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}