// eslint-disable-next-line import/no-unresolved
import '@next/types';

import { adminSdk } from '@gql/admin/api';
import { FileWrapper, FileCopyStatus } from '@file-upload/admin';
import type { EventPassNftByIdMinimal } from '@features/pass-types';
import { getPassOrganizer, getPassUser } from '@features/pass-common';
import { getCurrentUser } from '@next/next-auth/user';

const fileWrapper = new FileWrapper();

export const eventPassCheck = async (id: string) => {
  const user = await getCurrentUser();
  const res = await adminSdk.GetEventPassNftByIdMinimal(
    {
      id,
    },
    { cache: 'no-store' }
  );
  const eventPassNft = res.eventPassNft_by_pk;
  if (!eventPassNft || eventPassNft.currentOwnerAddress != user.address)
    throw new Error('Event Pass not owned by user');
  if (eventPassNft.isRevealed) throw new Error('Event Pass already revealed');
  // TODO: backstop in case a transfer of this nft is in progress
  return eventPassNft;
};

export const eventPassTransferQRCode = async (
  eventPassNft: EventPassNftByIdMinimal
) => {
  const { currentOwnerAddress, tokenId, eventId, eventPassId, organizerId } =
    eventPassNft;
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
    accountId: process.env.UPLOAD_ACCOUNT_ID as string,
  });
  if (resCopy.status !== FileCopyStatus.Copied) throw new Error(resCopy.status);
  // TODO: evaluate if need to delete file from organizer space or not ?
  // const resDelete = await fileWrapper.deleteFile({
  //   filePath: fileOrigin,
  //   accountId: process.env.UPLOAD_ACCOUNT_ID as string,
  // });
};

export const revealPass = async (id: string) => {
  const eventPass = await eventPassCheck(id);
  await eventPassTransferQRCode(eventPass);
  await adminSdk.SetEventPassNftRevealed({ id });
};
