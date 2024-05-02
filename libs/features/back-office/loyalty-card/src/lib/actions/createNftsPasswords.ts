'use client';

import env from '@env/client';
import { getCurrentChain } from '@next/chains';

import {
  CreateNftMintPasswordsProps,
  ThirdwebOrganizerCommon,
} from '@nft/thirdweb-organizer-common';
import { ThirdwebSDK } from '@thirdweb-dev/sdk';
import { Signer } from 'ethers';

export interface CreateNftsPasswordsProps extends CreateNftMintPasswordsProps {
  signer: Signer;
}

export async function createNftsPasswords({
  signer,
  ...props
}: CreateNftsPasswordsProps) {
  const currentChain = getCurrentChain();
  const sdk = new ThirdwebOrganizerCommon(
    ThirdwebSDK.fromSigner(signer, currentChain.urls[0], {
      clientId: env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID,
    }),
  );
  return sdk.createNftMintPasswords(props);
}
