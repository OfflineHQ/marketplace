import { FileSummary } from '@bytescale/sdk';
import env from '@env/server';
import {
  GetContentSpaceFolderPath,
  getContentSpaceFolderPath,
} from '@features/content-space-common';
import { FolderWrapper } from '@file-upload/admin';
import { cacheWithDynamicKeys } from '@next/cache';

export type GetContentSpaceFilesProps = GetContentSpaceFolderPath;

export const getContentSpaceFiles = cacheWithDynamicKeys(
  async (props: GetContentSpaceFilesProps) => {
    const folder = new FolderWrapper();
    const folderPath = getContentSpaceFolderPath(props);
    const list = await folder.listFolder({
      accountId: env.UPLOAD_ACCOUNT_ID,
      folderPath,
    });
    return list.items.filter((item): item is FileSummary => 'filePath' in item);
  },
  (props: [GetContentSpaceFilesProps]) => [
    `${props[0].organizerId}-${props[0].contentSpaceId}-getContentSpaceFiles`,
  ],
);
