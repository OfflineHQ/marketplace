'use server';
import { createOptions } from '@next/next-auth/options';
import type { AppUser } from '@next/types';
import { randomUUID } from 'crypto';
import { getServerSession as originalGetServerSession } from 'next-auth';
import { cookies, headers } from 'next/headers';

const createUnauthenticatedUserCookie = () => {
  const uuid = randomUUID();
  cookies().set('unauthenticated_user_id', uuid, {
    maxAge: 30 * 24 * 60 * 60,
  });
  return uuid;
};

export const getUnauthenticatedUserCookie = () => {
  return cookies().get('unauthenticated_user_id')?.value;
};

export const handleUnauthenticatedUser = () => {
  let unauthenticatedUserId = getUnauthenticatedUserCookie();
  if (!unauthenticatedUserId) {
    unauthenticatedUserId = createUnauthenticatedUserCookie();
  }
  return unauthenticatedUserId;
};

export const getCurrentUser = async (): Promise<AppUser | undefined> => {
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
  const session = await originalGetServerSession(req, res, createOptions(req));
  return session?.user;
};
