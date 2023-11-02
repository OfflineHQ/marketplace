'use server';
import { createOptions } from '@next/next-auth/options';
import type { AppUser } from '@next/types';
import { randomUUID } from 'crypto';
import { getServerSession as originalGetServerSession } from 'next-auth';
import { cookies } from 'next/headers';

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
  const session = await originalGetServerSession(createOptions());
  return session?.user;
};
