import { userSdk } from '@gql/user/api';
import { Locale, type Stage } from '@gql/shared/types';
import { FileDownloader } from '@file-upload/user';
import { isServerSide } from '@utils';
import { cookies } from 'next/headers';
import { nextAuthCookieName } from '@next/next-auth/common';
import { getPassUser } from './common';

export const getEventPassRevealedFilePath = async (id: string) => {
  const res = await userSdk.GetEventPassOwnedById(
    {
      id,
      locale: Locale.En,
      stage: isServerSide()
        ? (process.env.HYGRAPH_STAGE as Stage)
        : (process.env.NEXT_PUBLIC_HYGRAPH_STAGE as Stage),
    },
    { cache: 'no-store' }
  );
  const eventPassOwned = res.eventPassOwned_by_pk;
  if (!eventPassOwned) throw new Error('Event Pass not owned by user');
  if (!eventPassOwned.isRevealed) throw new Error('Event Pass is not revealed');
  const { eventPassId, address, tokenId, eventPass } = eventPassOwned;
  if (!eventPass?.event) throw new Error('Event not found');
  const { slug: eventSlug } = eventPass.event;
  if (!eventPass?.event?.organizer)
    throw new Error('Organizer for event not found');
  const { slug: organizerSlug } = eventPass.event.organizer;
  return getPassUser({
    address: eventPassOwned.address,
    organizerSlug,
    eventSlug,
    eventPassId,
    tokenId,
  });
};

export const downloadPass = async (
  id: string,
  action: 'display' | 'download' = 'download'
) => {
  if (isServerSide() && action === 'display')
    throw new Error('The action display can only be called on client side');
  const nextAuthJwt = cookies().get(nextAuthCookieName())?.toString();
  if (!nextAuthJwt) throw new Error('jwt cookie not found for user');
  const fileDownloader = new FileDownloader(
    isServerSide()
      ? (process.env.UPLOAD_ACCOUNT_ID as string)
      : (process.env.NEXT_PUBLIC_UPLOAD_ACCOUNT_ID as string),
    nextAuthJwt
  );
  const filePath = await getEventPassRevealedFilePath(id);
  const fileData = await fileDownloader.downloadFile(filePath);

  if (action === 'display') {
    return fileDownloader.toObjectURL(fileData as Blob);
  } else {
    if (fileData instanceof Buffer) {
      return fileData;
    } else {
      const buffer = await fileData.arrayBuffer();
      return Buffer.from(buffer);
    }
  }
};
