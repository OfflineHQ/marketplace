'use client';

import env from '@env/client';
import { NftCollection } from '@nft/thirdweb-organizer';
import { ThirdwebSDK } from '@thirdweb-dev/sdk';
import { Signer } from 'ethers';

export async function revealDelayedContract(
  signer: Signer,
  contractAddress: string,
) {
  const sdk = new NftCollection(
    ThirdwebSDK.fromSigner(signer, env.NEXT_PUBLIC_CHAIN, {
      clientId: env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID,
    }),
  );
  await sdk.revealDelayedContract(contractAddress);
}
