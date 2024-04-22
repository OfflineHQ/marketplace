'use client';

import env from '@env/client';
import { EventPassCollection } from '@nft/thirdweb-organizer-event-pass';
import { ThirdwebSDK } from '@thirdweb-dev/sdk';
import { Signer } from 'ethers';

export async function revealEventPassDelayedContract(
  signer: Signer,
  contractAddress: string,
) {
  const sdk = new EventPassCollection(
    ThirdwebSDK.fromSigner(signer, env.NEXT_PUBLIC_CHAIN, {
      clientId: env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID,
    }),
  );
  await sdk.revealEventPassDelayedContract(contractAddress);
}
