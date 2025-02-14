'use server';

import env from '@env/server';
import { GetContentSpaceFolderPath } from '@features/content-space-common';
import { FileWrapper } from '@file-upload/admin';
import { revalidateTag } from 'next/cache';

export type DeleteContentSpaceFileProps = GetContentSpaceFolderPath & {
  filePath: string;
};

export async function deleteContentSpaceFile({
  organizerId,
  contentSpaceId,
  filePath,
}: DeleteContentSpaceFileProps) {
  const fileApi = new FileWrapper();
  await fileApi.deleteFile({ accountId: env.BYTESCALE_ACCOUNT_ID, filePath });

  const revalidateTagKey = `${organizerId}-${contentSpaceId}-getContentSpaceFiles`;
  revalidateTag(revalidateTagKey);

  return { revalidateTagKey };
}
