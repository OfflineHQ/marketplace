import { userSdk } from '@gql/user/api';
import { adminSdk } from '@gql/admin/api';
import { FileWrapper, FileCopyStatus } from '@file-upload/admin';
import { Locale, type Stage } from '@gql/shared/types';
import type { EventPassOwnedById } from '@features/pass-types';
import { getPassOrganizer, getPassUser } from './common';

const fileWrapper = new FileWrapper();

export const eventPassCheck = async (id: string) => {
  const res = await userSdk.GetEventPassOwnedById(
    {
      id,
      locale: Locale.En,
      stage: process.env.HYGRAPH_STAGE as Stage,
    },
    { cache: 'no-store' }
  );
  const eventPassOwned = res.eventPassOwned_by_pk;
  if (!eventPassOwned) throw new Error('Event Pass not owned by user');
  if (eventPassOwned.isRevealed) throw new Error('Event Pass already revealed');
  return eventPassOwned;
};

export const eventPassTransferQRCode = async (
  eventPassOwned: EventPassOwnedById
) => {
  const { eventPassId, address, tokenId, eventPass } = eventPassOwned;
  if (!eventPass?.event) throw new Error('Event not found');
  const { slug: eventSlug } = eventPass.event;
  if (!eventPass?.event?.organizer)
    throw new Error('Organizer for event not found');
  const { slug: organizerSlug } = eventPass.event.organizer;
  const fileOrigin = getPassOrganizer({
    organizerSlug,
    eventSlug,
    eventPassId,
    tokenId,
  });
  const fileDest = getPassUser({
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
  // TODO: evaluate if need to delete file from organizer space or not ?
  // const resDelete = await fileWrapper.deleteFile({
  //   filePath: fileOrigin,
  //   accountId: process.env.UPLOAD_ACCOUNT_ID as string,
  // });
};

export const revealPass = async (id: string) => {
  const eventPass = await eventPassCheck(id);
  await eventPassTransferQRCode(eventPass);
  await adminSdk.SetEventPassOwnedRevealed({ id });
};
