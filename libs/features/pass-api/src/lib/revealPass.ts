'use server';

// eslint-disable-next-line import/no-unresolved
import '@next/types';

import env from '@env/server';
import { getPassOrganizer, getPassUser } from '@features/pass-common';
import type { EventPassNftByIdMinimal } from '@features/pass-types';
import { FileCopyStatusEnum, FileWrapper } from '@file-upload/admin';
import { adminSdk } from '@gql/admin/api';
import { EventPassNftContractType_Enum } from '@gql/shared/types';
import { getCurrentUser } from '@next/next-auth/user';

const fileWrapper = new FileWrapper();

export const eventPassCheck = async (id: string) => {
  const user = await getCurrentUser();
  if (!user) throw new Error('User not logged in');
  const res = await adminSdk.GetEventPassNftByIdWithEventPassNftContract(
    {
      id,
    },
    { cache: 'no-store' },
  );
  const eventPassNft = res.eventPassNft_by_pk;
  if (!eventPassNft || eventPassNft.currentOwnerAddress != user.address)
    throw new Error('Event Pass not owned by user');
  if (eventPassNft.isRevealed) throw new Error('Event Pass already revealed');
  if (!eventPassNft.eventPassNftContract)
    throw new Error('Event Pass has no contract associated');
  if (
    eventPassNft.eventPassNftContract.type ===
      EventPassNftContractType_Enum.DelayedReveal &&
    !eventPassNft.eventPassNftContract?.isDelayedRevealed
  )
    throw new Error('Event Pass is not ready to be revealed');
  // TODO: backstop in case a transfer of this nft is in progress
  return eventPassNft;
};

export const eventPassTransferQRCode = async (
  eventPassNft: EventPassNftByIdMinimal,
) => {
  const { currentOwnerAddress, tokenId, eventId, eventPassId, organizerId } =
    eventPassNft;
  if (!currentOwnerAddress) throw new Error('The pass is not owned by anyone');
  const fileOrigin = getPassOrganizer({
    organizerId,
    eventId,
    eventPassId,
    tokenId,
  });
  const fileDest = getPassUser({
    address: currentOwnerAddress,
    organizerId,
    eventId,
    eventPassId,
    tokenId,
  });
  const resCopy = await fileWrapper.copyFile({
    copyFileRequest: {
      source: fileOrigin,
      destination: fileDest,
    },
    accountId: env.UPLOAD_ACCOUNT_ID,
  });
  if (resCopy.status !== FileCopyStatusEnum.Copied)
    throw new Error(resCopy.status);
  // TODO: evaluate if need to delete file from organizer space or not ?
  // const resDelete = await fileWrapper.deleteFile({
  //   filePath: fileOrigin,
  //   accountId: env.UPLOAD_ACCOUNT_ID,
  // });
};

export const revealPass = async (id: string) => {
  const eventPass = await eventPassCheck(id);
  await eventPassTransferQRCode(eventPass);
  await adminSdk.SetEventPassNftRevealed({ id });
};
