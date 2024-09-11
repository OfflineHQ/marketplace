'use server';

import env from '@env/server';
import {
  getContentSpaceFolderPath,
  type GetContentSpaceFolderPath,
} from '@features/content-space-common';
import { FileWrapper } from '@file-upload/admin';
import { RowSelectionState } from '@tanstack/react-table';
import { revalidateTag } from 'next/cache';

export type DeleteContentSpaceFilesProps = GetContentSpaceFolderPath & {
  filesSelected: RowSelectionState;
};

export async function deleteContentSpaceFiles({
  organizerId,
  contentSpaceId,
  filesSelected,
}: DeleteContentSpaceFilesProps) {
  const folderPath = getContentSpaceFolderPath({
    organizerId,
    contentSpaceId,
  });
  const fileApi = new FileWrapper();
  const filesToDelete = Object.entries(filesSelected)
    .filter(([_fileName, selected]) => selected)
    .map(([fileName, _selected]) => `${folderPath}/${fileName}`);
  if (!filesToDelete.length) throw new Error('No files to delete selected');
  await fileApi.deleteFilesBatchWithRetry(
    env.BYTESCALE_ACCOUNT_ID,
    filesToDelete,
  );
  const revalidateTagKey = `${organizerId}-${contentSpaceId}-getContentSpaceFiles`;
  revalidateTag(revalidateTagKey);
  return { revalidateTagKey };
}
