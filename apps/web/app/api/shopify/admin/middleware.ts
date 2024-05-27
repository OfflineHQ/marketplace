import env from '@env/server';
import * as jwt from 'jsonwebtoken';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export const config = {
  matcher: '/api/shopify/admin/:path*',
};

// WIP: Complete the implementation of Shopify admin API middleware.
// This includes verifying session tokens, errors and test more thoughtfully with shopify app making requests using APP Bridge
export async function middleware(request: NextRequest) {
  const sessionToken = request.headers
    .get('X-Shopify-Access-Token')
    ?.split('Bearer ')[1];
  if (!sessionToken) {
    return new Response('Unauthorized: No session token provided', {
      status: 401,
    });
  }

  try {
    jwt.verify(sessionToken, env.SHOPIFY_API_SECRET, {
      algorithms: ['HS256'],
    });

    return NextResponse.next();
  } catch (error) {
    console.error('Token verification error:', error);
    return new Response('Unauthorized: Invalid token', { status: 401 });
  }
}
