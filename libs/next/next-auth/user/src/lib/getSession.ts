'use server';
import { createOptions } from '@next/next-auth/options';
import { getServerSession } from 'next-auth';

export const getSession = async () => {
  return getServerSession(createOptions());
};
