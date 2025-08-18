import { NextRequest, NextResponse } from 'next/server';
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

export async function GET(request: NextRequest) {
  try {
    const authHeader =
      request.headers.get('authorization') ||
      request.headers.get('Authorization') ||
      '';

    const token = authHeader.startsWith('Bearer ')
      ? authHeader.slice(7)
      : '';

    if (!token) {
      throw new ApiError('Authentication required', 401);
    }

    const decoded = jwt.verify(token, JWT_SECRET) as {
      userId: string;
      email?: string;
      iat?: number;
      exp?: number;
    };

    if (!decoded?.userId) {
      throw new ApiError('Invalid token', 401);
    }

    const users = await query<DbUser>(
      'SELECT id, email, name, created_at FROM public.users WHERE id = $1',
      [decoded.userId]
    );

    if (!users || users.length === 0) {
      throw new ApiError('User not found', 404);
    }

    const user = users[0];

    return NextResponse.json({
      success: true,
      user
    });
  } catch (error) {
    return handleRouteError(error);
  }
}