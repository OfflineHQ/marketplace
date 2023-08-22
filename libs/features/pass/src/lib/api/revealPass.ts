import { userSdk } from '@gql/user/api';
import { adminSdk } from '@gql/admin/api';
import { FileWrapper, FileCopyStatus } from '@file-upload/admin';
import type { EventPassNftById } from '@features/pass-types';
import { getPassOrganizer, getPassUser } from './common';

const fileWrapper = new FileWrapper();

export const eventPassCheck = async (id: string) => {
  const res = await userSdk.GetEventPassNftById(
    {
      id,
    },
    { cache: 'no-store' }
  );
  const eventPassNft = res.eventPassNft_by_pk;
  if (!eventPassNft) throw new Error('Event Pass not owned by user');
  if (eventPassNft.isRevealed) throw new Error('Event Pass already revealed');
  return eventPassNft;
};

export const eventPassTransferQRCode = async (
  eventPassNft: EventPassNftById
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
