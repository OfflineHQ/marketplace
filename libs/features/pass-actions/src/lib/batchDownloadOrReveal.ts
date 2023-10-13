'use server';

import { revealPass, downloadPass } from '@features/pass-api';
import { EventWithEventPassNfts } from '@features/pass-types';
import { revalidateTag } from 'next/cache';

export async function batchDownloadOrReveal(
  eventPassNfts: EventWithEventPassNfts['eventPassNftContracts'][0]['eventPassNfts'],
) {
  let revealCalled = false;
  console.log('eventPassNfts', eventPassNfts);
  const promises = eventPassNfts.map((eventPassNft) => {
    console.log('eventPassNft', eventPassNft);
    if (!eventPassNft.isRevealed) {
      revealCalled = true;
      return revealPass(eventPassNft.id)
        .then(() => ({ status: 'fulfilled' }))
        .catch((error) => {
          throw error;
        });
    } else {
      return downloadPass(eventPassNft.id)
        .then(() => ({ status: 'fulfilled' }))
        .catch((error) => {
          throw error;
        });
    }
  });

  const results = await Promise.allSettled(promises);

  console.log('results', results);

  results.forEach((result, index) => {
    if (result.status === 'rejected') {
      throw result.reason;
    }
  });

  if (revealCalled) {
    revalidateTag('userEventPassNfts');
  }
}
