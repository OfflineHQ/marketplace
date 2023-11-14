'use server';

import env from '@env/server';
import * as jsonwebtoken from 'jsonwebtoken';
import type { JWT } from 'next-auth/jwt';
import { getToken } from 'next-auth/jwt';
import { cookies, headers } from 'next/headers';

export const getJwt = async ({
  raw,
}: {
  raw: boolean;
}): Promise<JWT | string> => {
  const secret = env.NEXTAUTH_SECRET;
  const jwt = await getToken({
    req: {
      headers: Object.fromEntries(headers() as any),
      cookies: Object.fromEntries(
        cookies()
          .getAll()
          .map((c) => [c.name, c.value]),
      ),
    } as any,
    secret,
    raw: true,
    cookieName: nextAuthCookieName(),
  });
  if (raw) return jwt;
  return jsonwebtoken.verify(jwt as string, secret as string, {
    algorithms: ['RS256'],
  }) as JWT;
};
