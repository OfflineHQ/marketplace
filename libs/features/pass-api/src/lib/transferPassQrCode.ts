import { FileWrapper, FileCopyStatus } from '@file-upload/admin';
import type { EventPassNftById } from '@features/pass-types';
import { getPassUser } from '@features/pass-common';

const fileWrapper = new FileWrapper();

export const transferPassQrCode = async (
  formerOwnerAddress: string,
  eventPassNft: EventPassNftById
) => {
  const { currentOwnerAddress, tokenId, eventId, eventPassId, organizerId } =
    eventPassNft;
  const fileOrigin = getPassUser({
    address: formerOwnerAddress,
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
  await fileWrapper.deleteFile({
    filePath: fileOrigin,
    accountId: process.env.UPLOAD_ACCOUNT_ID as string,
  });
};
