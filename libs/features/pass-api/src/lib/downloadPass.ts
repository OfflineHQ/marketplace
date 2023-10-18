import env from '@env/client';
import envServer from '@env/server';
import { getPassUser } from '@features/pass-common';
import { FileDownloader } from '@file-upload/user';
import { adminSdk } from '@gql/admin/api';
import { nextAuthCookieName } from '@next/next-auth/common';
import { isServerSide } from '@utils';
import { cookies } from 'next/headers';

export const getEventPassRevealedFilePath = async (id: string) => {
  const res = await adminSdk.GetEventPassNftByIdMinimal(
    {
      id,
    },
    { cache: 'no-store' }
  );
  const eventPassNft = res.eventPassNft_by_pk;
  if (!eventPassNft) throw new Error('Event Pass not owned by user');
  if (!eventPassNft.isRevealed) throw new Error('Event Pass is not revealed');
  const { currentOwnerAddress, tokenId, eventId, eventPassId, organizerId } =
    eventPassNft;
  if (!currentOwnerAddress) throw new Error('The pass is not owned by anyone');
  return getPassUser({
    address: currentOwnerAddress,
    eventId,
    organizerId,
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
      ? envServer.UPLOAD_ACCOUNT_ID
      : env.NEXT_PUBLIC_UPLOAD_ACCOUNT_ID,
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
