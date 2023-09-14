'use server';
import { cookies, headers } from 'next/headers';
import { getServerSession as originalGetServerSession } from 'next-auth';
import { authOptions } from '@next/next-auth/options';
import type { User } from 'next-auth';

export const getCurrentUser = async (): Promise<User | undefined> => {
  // This is a workaround for bug with getServerSession not working with server action imported in client component https://github.com/nextauthjs/next-auth/issues/7486#issuecomment-1543747325
  const req = {
    headers: Object.fromEntries(headers() as any),
    cookies: Object.fromEntries(
      cookies()
        .getAll()
        .map((c) => [c.name, c.value])
    ),
  };
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  const res = { getHeader() {}, setCookie() {}, setHeader() {} };
  // @ts-ignore - The type used in next-auth for the req object doesn't match, but it still works
  const session = await originalGetServerSession(req, res, authOptions);
  // const session = await originalGetServerSession(authOptions);
  return session?.user;
};
