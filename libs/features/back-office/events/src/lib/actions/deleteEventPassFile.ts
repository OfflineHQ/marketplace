'use server';

import env from '@env/server';
import { type GetEventPassOrganizerFolderPath } from '@features/pass-common';
import { FileWrapper } from '@file-upload/admin';
import { revalidateTag } from 'next/cache';

export type DeleteEventPassFileProps = GetEventPassOrganizerFolderPath & {
  filePath: string;
};

export async function deleteEventPassFile({
  organizerId,
  eventId,
  eventPassId,
  filePath,
}: DeleteEventPassFileProps) {
  const fileApi = new FileWrapper();
  await fileApi.deleteFile({ accountId: env.BYTESCALE_ACCOUNT_ID, filePath });
  const revalidateTagKey = `${organizerId}-${eventId}-${eventPassId}-getEventPassNftFile`;
  revalidateTag(revalidateTagKey);
  return { revalidateTagKey };
}
