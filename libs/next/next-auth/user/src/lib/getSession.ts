'use server';
import { createOptions } from '@next/next-auth/options';
import { getServerSession } from 'next-auth';
import { cookies, headers } from 'next/headers';

export const getSession = async () => {
  // This is a workaround for bug with getServerSession not working with server action imported in client component https://github.com/nextauthjs/next-auth/issues/7486#issuecomment-1543747325
  const req = {
    headers: Object.fromEntries(headers() as any),
    cookies: Object.fromEntries(
      cookies()
        .getAll()
        .map((c) => [c.name, c.value]),
    ),
  };
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  const res = { getHeader() {}, setCookie() {}, setHeader() {} };
  // @ts-ignore - The type used in next-auth for the req object doesn't match, but it still works
  return getServerSession(req, res, createOptions(req));
};
