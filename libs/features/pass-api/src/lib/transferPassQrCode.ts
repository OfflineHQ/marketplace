import env from '@env/server';
import { getPassUser } from '@features/pass-common';
import type { EventPassNftById } from '@features/pass-types';
import { FileCopyStatusEnum, FileWrapper } from '@file-upload/admin';

const fileWrapper = new FileWrapper();

export const transferPassQrCode = async (
  formerOwnerAddress: string,
  eventPassNft: EventPassNftById,
) => {
  const { currentOwnerAddress, tokenId, eventId, eventPassId, organizerId } =
    eventPassNft;
  if (!currentOwnerAddress) throw new Error('The pass is not owned by anyone');
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
    accountId: env.UPLOAD_ACCOUNT_ID,
  });
  if (resCopy.status !== FileCopyStatusEnum.Copied)
    throw new Error(resCopy.status);
  await fileWrapper.deleteFile({
    filePath: fileOrigin,
    accountId: env.UPLOAD_ACCOUNT_ID,
  });
};
