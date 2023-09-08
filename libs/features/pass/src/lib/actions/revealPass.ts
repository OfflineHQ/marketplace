'use server';

import { revealPass as revealPassApi, downloadPass } from '@features/pass-api';
import { revalidateTag } from 'next/cache';

export async function revealPass(id: Parameters<typeof revealPassApi>[0]) {
  await revealPassApi(id);
  await downloadPass(id);
  revalidateTag('userEventPassNfts');
}
