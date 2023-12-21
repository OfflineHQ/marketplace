'use server';

import env from '@env/server';

import {
  GetEventPassOrganizerFolderPath,
  getEventPassOrganizerFolderPath,
} from '@features/pass-common';
import { FileWrapper } from '@file-upload/admin';

export type RenameEventPassNftFilesProps = GetEventPassOrganizerFolderPath & {
  filesPath: string[];
};

export async function renameEventPassNftFiles({
  filesPath,
  organizerId,
  eventId,
  eventPassId,
}: RenameEventPassNftFilesProps) {
  if (!filesPath?.length) return;
  const fileWrapper = new FileWrapper();
  const folderPath = getEventPassOrganizerFolderPath({
    organizerId,
    eventId,
    eventPassId,
  });
  const modifiedFilesPath = filesPath.map((filePath, index) => ({
    source: filePath,
    destination: `${folderPath}/${eventId}-${eventPassId}-${index}.${filePath
      .split('.')
      .pop()}`,
  }));
  await fileWrapper.copyFileBatchWithRetry(
    env.UPLOAD_ACCOUNT_ID,
    modifiedFilesPath,
  );
  await fileWrapper.deleteFilesBatchWithRetry(env.UPLOAD_ACCOUNT_ID, filesPath);
}
