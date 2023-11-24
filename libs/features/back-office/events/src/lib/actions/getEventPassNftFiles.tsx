import { FileSummary } from '@bytescale/sdk';
import env from '@env/server';
import {
  getEventPassOrganizerFolderPath,
  type GetEventPassOrganizerFolderPath,
} from '@features/pass-common';
import { FolderWrapper } from '@file-upload/admin';

export type GetEventPassNftFilesProps = GetEventPassOrganizerFolderPath

export async function getEventPassNftFiles(props: GetEventPassNftFilesProps) {
  const folder = new FolderWrapper();
  const folderPath = getEventPassOrganizerFolderPath(props);
  const list = await folder.listFolder({
    accountId: env.UPLOAD_ACCOUNT_ID,
    folderPath: folderPath,
  });
  return list.items.filter(
    (item): item is FileSummary => 'filePath' in item,
  );
}
