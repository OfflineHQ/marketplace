'use server';

import { getToken } from 'next-auth/jwt';
import { headers, cookies } from 'next/headers';

export const getJwt = async () => {
  return await getToken({
    req: {
      headers: Object.fromEntries(headers() as any),
      cookies: Object.fromEntries(
        cookies()
          .getAll()
          .map((c) => [c.name, c.value])
      ),
    } as any,
    secret: process.env.NEXTAUTH_SECRET,
    raw: true,
  });
};
