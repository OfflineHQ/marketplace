import { FolderWrapper } from '@file-upload/admin';

const folder = new FolderWrapper();
import env from '@env/server';

export const createSecureStorageForUser = (address: string) => {
  const folderPath = `/${env.UPLOAD_PATH_PREFIX}/users/${address}`;
  return folder.putFolder({
    putFolderRequest: {
      allowUnnamedFolder: false,
      folderPath,
    },
    accountId: env.UPLOAD_ACCOUNT_ID,
  });
};
