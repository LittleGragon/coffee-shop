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
  password_hash: string;
  created_at: string;
};

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      throw new ApiError('Email and password are required', 400);
    }

    const users = await query<DbUser>(
      'SELECT id, email, name, password_hash, created_at FROM public.users WHERE email = $1',
      [email]
    );

    if (!users || users.length === 0) {
      throw new ApiError('Invalid email or password', 401);
    }

    const user = users[0];
    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) {
      throw new ApiError('Invalid email or password', 401);
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        created_at: user.created_at
      },
      token
    });
  } catch (error) {
    return handleRouteError(error);
  }
}