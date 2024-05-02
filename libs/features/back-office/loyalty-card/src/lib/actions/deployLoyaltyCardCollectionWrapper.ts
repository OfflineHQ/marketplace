'use client';

import { getCurrentChain } from '@next/chains';

import env from '@env/client';
import {
  DeployLoyaltyCardContractProps,
  LoyaltyCardCollection,
} from '@nft/thirdweb-organizer-loyalty-card';
import { ThirdwebSDK } from '@thirdweb-dev/sdk';
import { Signer } from 'ethers';

export interface DeployLoyaltyCardCollectionWrapperProps
  extends DeployLoyaltyCardContractProps {
  signer: Signer;
}

export async function deployLoyaltyCardCollectionWrapper({
  signer,
  ...props
}: DeployLoyaltyCardCollectionWrapperProps) {
  const currentChain = getCurrentChain();
  const sdk = new LoyaltyCardCollection(
    ThirdwebSDK.fromSigner(signer, currentChain.urls[0], {
      clientId: env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID,
    }),
  );
  return sdk.deployLoyaltyCardCollection(props);
}
