'use server';

import { revealPass as revealPassApi } from '@features/pass-api';
import { revalidateTag } from 'next/cache';

export async function revealPass(id: Parameters<typeof revealPassApi>[0]) {
  await revealPassApi(id);
  revalidateTag('userEventPassNfts');
}
