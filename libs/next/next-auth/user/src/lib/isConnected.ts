'use server';

import { nextAuthCookieName } from '@next/next-auth/common';
import { cookies } from 'next/headers';

export const isConnected = async () => {
  const nextAuthJwt = cookies().get(nextAuthCookieName())?.toString();
  return !!nextAuthJwt;
};
