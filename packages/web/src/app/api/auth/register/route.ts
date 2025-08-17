import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { query } from '@/lib/db';
import { ApiError, handleRouteError } from '@/lib/api-error';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

type DbUser = {
  id: string;
  email: string;
  name: string;
  created_at: string;
};

export async function POST(request: NextRequest) {
  try {
    const { email, password, name } = await request.json();

    if (!email || !password || !name) {
      throw new ApiError('Email, password, and name are required', 400);
    }

    const existing = await query<{ id: string }>(
      'SELECT id FROM public.users WHERE email = $1',
      [email]
    );

    if (existing && existing.length > 0) {
      throw new ApiError('User already exists with this email', 409);
    }

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const created = await query<DbUser>(
      `INSERT INTO public.users (email, password_hash, name, created_at, updated_at)
       VALUES ($1, $2, $3, NOW(), NOW())
       RETURNING id, email, name, created_at`,
      [email, passwordHash, name]
    );

    const user = created[0];

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return NextResponse.json({
      success: true,
      user,
      token
    }, { status: 201 });
  } catch (error) {
    return handleRouteError(error);
  }
}