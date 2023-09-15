import { NextRequest, NextResponse } from 'next/server';
import { getJwt } from '@next/next-auth/user';
import * as jsonwebtoken from 'jsonwebtoken';
import { JWT } from 'next-auth/jwt';

export const config = {
  runtime: 'edge',
};

export async function GET(req: NextRequest) {
  const { iat, exp, access, sub } = (await getJwt({ raw: false })) as JWT;
  const payload = { iat, exp, access, sub };
  const jwt = jsonwebtoken.sign(
    payload!,
    process.env.UPLOAD_SECRET_JWT as string,
    {
      algorithm: 'RS256',
    }
  );
  //console.log('jwt', jwt);
  return new NextResponse(jwt, {
    status: 200,
    headers: {
      'content-type': 'text/plain',
    },
  });
}
