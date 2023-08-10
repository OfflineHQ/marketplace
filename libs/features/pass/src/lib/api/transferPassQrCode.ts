import { FileWrapper, FileCopyStatus } from '@file-upload/admin';
import type { EventPassOwnedById } from '@features/pass-types';
import { getPassUser } from './common';

const fileWrapper = new FileWrapper();

export const transferPassQrCode = async (
  formerOwnerAddress: string,
  eventPassOwned: EventPassOwnedById
) => {
  const { eventPassId, address, tokenId, eventPass } = eventPassOwned;
  if (!eventPass?.event) throw new Error('Event not found');
  const { slug: eventSlug } = eventPass.event;
  if (!eventPass?.event?.organizer)
    throw new Error('Organizer for event not found');
  const { slug: organizerSlug } = eventPass.event.organizer;
  const fileOrigin = getPassUser({
    address: formerOwnerAddress,
    organizerSlug,
    eventSlug,
    eventPassId,
    tokenId,
  });
  const fileDest = getPassUser({
    address,
    organizerSlug,
    eventSlug,
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
