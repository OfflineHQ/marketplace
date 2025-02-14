import { FileSummary } from '@bytescale/sdk';
import env from '@env/server';
import {
  getEventPassOrganizerFolderPath,
  type GetEventPassOrganizerFolderPath,
} from '@features/pass-common';
import { FolderWrapper } from '@file-upload/admin';
import { cacheWithDynamicKeys } from '@next/cache';

export type GetEventPassNftFilesProps = GetEventPassOrganizerFolderPath;

export const getEventPassNftFiles = cacheWithDynamicKeys(
  async (props: GetEventPassNftFilesProps) => {
    const folder = new FolderWrapper();
    const folderPath = getEventPassOrganizerFolderPath(props);
    const list = await folder.listFolder({
      accountId: env.BYTESCALE_ACCOUNT_ID,
      folderPath,
    });
    return list.items.filter((item): item is FileSummary => 'filePath' in item);
  },
  async (props: [GetEventPassNftFilesProps]) =>
    Promise.resolve([
      `${props[0].organizerId}-${props[0].eventId}-${props[0].eventPassId}-getEventPassNftFiles`,
    ]),
);
