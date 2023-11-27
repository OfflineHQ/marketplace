'use client';

import * as Bytescale from '@bytescale/sdk';
import { getEventPassRevealedFilePath, revealPass } from '@features/pass-api';
import { EventWithEventPassNfts } from '@features/pass-types';
import { getCurrentUser } from '@next/next-auth/user';
import { getNextAppURL } from '@shared/client';
import { revalidateTag } from 'next/cache';
import { env } from 'process';

async function downloadPass(slug: string, id: string, tokenId: string) {
  try {
    await Bytescale.AuthManager.beginAuthSession({
      accountId: env.NEXT_PUBLIC_UPLOAD_ACCOUNT_ID || 'FW25ba3',
      authUrl: `${getNextAppURL()}/api/bytescale/jwt`,
      authHeaders: async () => Promise.resolve({}),
    });

    const user = await getCurrentUser();
    const filePath = await getEventPassRevealedFilePath(id, user?.address);

    const fileApi = new Bytescale.FileApi({
      fetchApi: fetch,
      apiKey: 'public_FW25ba36mEdkrUv4r6qd45EtSRpT',
    });

    const fileData = await fileApi.downloadFile({
      accountId: 'FW25ba3',
      filePath: filePath,
    });

    const fileBlob = await fileData.blob();

    const csvURL = URL.createObjectURL(fileBlob);
    const link = document.createElement('a');
    link.href = csvURL;
    link.setAttribute('download', `${slug}-${tokenId}.png`);
    link.click();

    Bytescale.AuthManager.endAuthSession();
  } catch (error) {
    Bytescale.AuthManager.endAuthSession();
    console.error(error);
  }
}

export async function batchDownloadOrReveal(
  slug: string,
  eventPassNfts: EventWithEventPassNfts['eventPassNftContracts'][0]['eventPassNfts'],
) {
  let revealCalled = false;
  for (const eventPassNft of eventPassNfts) {
    if (!eventPassNft.isRevealed) {
      revealCalled = true;
      await revealPass(eventPassNft.id);
    }
    await downloadPass(slug, eventPassNft.id, eventPassNft.tokenId);
  }

  if (revealCalled) {
    revalidateTag('userEventPassNfts');
  }
}
