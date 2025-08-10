import { NextRequest, NextResponse } from 'next/server';
import { testConnection } from '@/lib/db';

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
  } catch (error) {
    console.error('Error testing database connection:', error);
    return NextResponse.json({ 
      status: 'error', 
      message: 'Error testing database connection',
      error: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}