'use server';

import { getPassUser } from '@features/pass-common';
import { adminSdk } from '@gql/admin/api';

export const getEventPassRevealedFilePath = async (
  id: string,
  userAddress?: string,
) => {
  const res = await adminSdk.GetEventPassNftByIdMinimal(
    {
      id,
    },
    { cache: 'no-store' },
  );
  const eventPassNft = res.eventPassNft_by_pk;
  if (!eventPassNft) throw new Error('Event Pass not owned by user');
  if (!eventPassNft.isRevealed) throw new Error('Event Pass is not revealed');
  const { currentOwnerAddress, tokenId, eventId, eventPassId, organizerId } =
    eventPassNft;
  if (!currentOwnerAddress) throw new Error('The pass is not owned by anyone');
  if (userAddress && currentOwnerAddress !== userAddress)
    throw new Error(
      `The pass is not owned by the specified user : ${userAddress}`,
    );
  return getPassUser({
    address: currentOwnerAddress,
    eventId,
    organizerId,
    eventPassId,
    tokenId,
  });
};
