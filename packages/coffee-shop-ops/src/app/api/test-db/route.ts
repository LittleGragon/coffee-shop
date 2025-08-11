import { NextRequest, NextResponse } from 'next/server';
import { testConnection } from '@/lib/db';
import { ApiError } from '@/utils/error-handler';
import { handleRouteError } from '../error';

export async function GET(request: NextRequest) {
  try {
    const isConnected = await testConnection();
    
    if (isConnected) {
      return NextResponse.json({ 
        status: 'success', 
        message: 'Database connection successful' 
      });
    } else {
      return NextResponse.json({ 
        status: 'error', 
        message: 'Database connection failed' 
      }, { status: 500 });
    }
  } catch (error: unknown) {
    return handleRouteError(error);
  }, { status: 500 });
  }
}