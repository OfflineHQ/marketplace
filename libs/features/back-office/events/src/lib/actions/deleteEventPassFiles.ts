'use server';

import env from '@env/server';
import {
  getEventPassOrganizerFolderPath,
  type GetEventPassOrganizerFolderPath,
} from '@features/pass-common';
import { FileWrapper } from '@file-upload/admin';
import { RowSelectionState } from '@tanstack/react-table';
import { revalidateTag } from 'next/cache';

export type DeleteEventPassFilesProps = GetEventPassOrganizerFolderPath & {
  filesSelected: RowSelectionState;
};

export async function deleteEventPassFiles({
  organizerId,
  eventId,
  eventPassId,
  filesSelected,
}: DeleteEventPassFilesProps) {
  const folderPath = getEventPassOrganizerFolderPath({
    organizerId,
    eventId,
    eventPassId,
  });
  const fileApi = new FileWrapper();
  const filesToDelete = Object.entries(filesSelected)
    .filter(([_fileName, selected]) => selected)
    .map(([fileName, _selected]) => `${folderPath}/${fileName}`);
  if (!filesToDelete.length) throw new Error('No files to delete selected');
  await fileApi.deleteFilesBatchWithRetry(env.UPLOAD_ACCOUNT_ID, filesToDelete);
  revalidateTag(
    `${organizerId}-${eventId}-${eventPassId}-getEventPassNftFiles`,
  );
}
