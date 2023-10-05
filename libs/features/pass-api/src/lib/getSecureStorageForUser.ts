import { FolderWrapper } from '@file-upload/admin';
import env from '@env/server';

const folder = new FolderWrapper();

export const getSecureStorageForUser = (address: string) => {
  const folderPath = `/${env.UPLOAD_PATH_PREFIX}/users/${address}`;
  return folder.putFolder({
    putFolderRequest: {
      allowUnnamedFolder: false,
      folderPath,
    },
    accountId: env.UPLOAD_ACCOUNT_ID,
  });
};
