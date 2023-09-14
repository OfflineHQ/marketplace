'use server';

import { revealPass, downloadPass } from '@features/pass-api';
import { EventWithEventPassNfts } from '@features/pass-types';
import { revalidateTag } from 'next/cache';

export async function batchDownloadOrReveal(
  eventPassNfts: EventWithEventPassNfts['eventPassNftContracts'][0]['eventPassNfts']
) {
  let revealCalled = false;

  const promises = eventPassNfts.map((eventPassNft) => {
    if (!eventPassNft.isRevealed) {
      revealCalled = true;
      return revealPass(eventPassNft.id)
        .then(() => ({ status: 'fulfilled' }))
        .catch((error) => ({ status: 'rejected', reason: error }));
    } else {
      return downloadPass(eventPassNft.id)
        .then(() => ({ status: 'fulfilled' }))
        .catch((error) => ({ status: 'rejected', reason: error }));
    }
  });

  const results = await Promise.allSettled(promises);

  results.forEach((result, index) => {
    if (result.status === 'rejected') {
      console.error(
        `Error with eventPassNft at index ${index}: ${result.reason}`
      );
    }
  });

  if (revealCalled) {
    revalidateTag('userEventPassNfts');
  }
}
