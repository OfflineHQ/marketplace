'use server';

import { getToken } from 'next-auth/jwt';
import { headers, cookies } from 'next/headers';
import * as jsonwebtoken from 'jsonwebtoken';

export const getJwt = async ({
  raw,
}: {
  raw: boolean;
}): Promise<jsonwebtoken.JwtPayload | string> => {
  const secret = process.env.NEXTAUTH_SECRET;
  const jwt = await getToken({
    req: {
      headers: Object.fromEntries(headers() as any),
      cookies: Object.fromEntries(
        cookies()
          .getAll()
          .map((c) => [c.name, c.value])
      ),
    } as any,
    secret,
    raw: true,
  });
  if (raw) return jwt;
  return jsonwebtoken.verify(jwt as string, secret as string, {
    algorithms: ['RS256'],
  });
};
