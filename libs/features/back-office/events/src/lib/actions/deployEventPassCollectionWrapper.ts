'use client';

import env from '@env/client';
import { EventPass } from '@features/back-office/events-types';
import { EventPassNftContractType_Enum } from '@gql/shared/types';
import { EventPassCollection } from '@nft/thirdweb-organizer-event-pass';
import { EventSmallData } from '@nft/types';
import { ThirdwebSDK } from '@thirdweb-dev/sdk';
import { Signer } from 'ethers';
export interface DeployCollectionWrapperProps extends EventSmallData {
  // signer: JsonRpcSigner;
  signer: Signer;
  eventPassId: string;
  eventPass: EventPass;
  eventPassType: EventPassNftContractType_Enum;
}

export async function deployEventPassCollectionWrapper({
  signer,
  organizerId,
  eventId,
  eventSlug,
  eventPassType,
  eventPass,
}: DeployCollectionWrapperProps) {
  const sdk = new EventPassCollection(
    ThirdwebSDK.fromSigner(signer, env.NEXT_PUBLIC_CHAIN, {
      clientId: env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID,
    }),
  );
  return sdk.deployEventPassCollection(
    eventPass,
    {
      organizerId,
      eventId,
      eventSlug,
    },
    eventPassType,
  );
}
