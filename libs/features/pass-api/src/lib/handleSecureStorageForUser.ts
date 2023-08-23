import { FolderWrapper } from '@file-upload/admin';

const folder = new FolderWrapper();

export const handleSecureStorageForUser = (address: string) => {
  const folderPath = `/${process.env.UPLOAD_PATH_PREFIX}/users/${address}`;
  return folder.putFolder({
    putFolderRequest: {
      allowUnnamedFolder: false,
      folderPath,
    },
    accountId: process.env.UPLOAD_ACCOUNT_ID as string,
  });
};
