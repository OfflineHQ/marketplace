'use client';
import { EventPass } from '@features/back-office/events-types';
import { EventPassNftContractType_Enum } from '@gql/shared/types';
import NftCollection from '@nft/thirdweb-organizer';
import { EventSmallData } from '@nft/types';
import { Signer } from 'ethers';
export interface DeployCollectionWrapperProps extends EventSmallData {
  // signer: JsonRpcSigner;
  signer: Signer;
  eventPassId: string;
  eventPass: EventPass;
  eventPassType: EventPassNftContractType_Enum;
}

export async function deployCollectionWrapper({
  signer,
  organizerId,
  eventId,
  eventSlug,
  eventPassType,
  eventPass,
}: DeployCollectionWrapperProps) {
  const sdk = new NftCollection(signer);
  await sdk.deployACollection(
    eventPass,
    {
      organizerId,
      eventId,
      eventSlug,
    },
    eventPassType,
  );
}
