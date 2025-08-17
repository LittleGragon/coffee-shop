import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { query } from '@/lib/db';
import { ApiError } from '@/utils/error-handler';
import { handleRouteError } from '@/lib/api-error';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

type DbUser = {
  id: string;
  email: string;
  name: string;
  created_at: string;
};

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new ApiError('No token provided', 401);
    }

    const token = authHeader.substring(7);

    let decoded: { userId: string; email: string };
    try {
      decoded = jwt.verify(token, JWT_SECRET) as { userId: string; email: string };
    } catch {
      throw new ApiError('Invalid token', 401);
    }

    const users = await query<DbUser>(
      'SELECT id, email, name, created_at FROM users WHERE id = $1',
      [decoded.userId]
    );

    if (!users || users.length === 0) {
      throw new ApiError('User not found', 404);
    }

    const user = users[0];

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        created_at: user.created_at
      }
    });
  } catch (error) {
    return handleRouteError(error);
  }
}