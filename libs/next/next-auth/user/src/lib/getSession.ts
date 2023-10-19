'use server';
import { createOptions } from '@next/next-auth/options';
import { getServerSession } from 'next-auth/next';

export const getSession = async () => {
  return getServerSession(createOptions({} as unknown as any));
};
