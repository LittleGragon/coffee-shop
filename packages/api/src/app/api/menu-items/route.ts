import { NextRequest, NextResponse } from 'next/server';

// This is a compatibility route that redirects to /api/menu
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');
  const isAvailable = searchParams.get('available');
  
  // Build the redirect URL
  let redirectUrl = `${request.nextUrl.origin}/api/menu`;
  const params = new URLSearchParams();
  
  if (category) params.append('category', category);
  if (isAvailable) params.append('available', isAvailable);
  
  const queryString = params.toString();
  if (queryString) redirectUrl += `?${queryString}`;
  
  // Redirect to the new endpoint
  return NextResponse.redirect(redirectUrl);
}