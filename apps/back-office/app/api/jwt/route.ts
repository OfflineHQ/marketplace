// apps/back-office/app/api/auth/jwt.ts
import { NextRequest, NextResponse } from 'next/server';
import { getJwt } from '@next/next-auth/user';

export const config = {
  runtime: 'edge',
};

export async function GET(req: NextRequest) {
  const jwt = await getJwt({ raw: true });
  return new NextResponse(jwt as string, {
    status: 200,
    headers: {
      'content-type': 'text/plain',
    },
  });
}
