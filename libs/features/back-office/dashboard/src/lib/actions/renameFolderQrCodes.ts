'use server';

import env from '@env/server';
import { FileWrapper, FolderWrapper } from '@file-upload/admin';
import { revalidatePath } from 'next/cache';

export async function checkFolderLength(folderPath: string, maxAmount: number) {
  const folder = new FolderWrapper();

  const list = await folder.listFolder({
    accountId: env.UPLOAD_ACCOUNT_ID,
    folderPath: folderPath,
  });
  revalidatePath('/fr/Dashboard');

  const simplifiedList = list.items
    .map((item) => {
      if (item.type === 'File') {
        return {
          path: item.filePath,
        };
      }
      return null;
    })
    .filter((item) => item !== null);

  return {
    isEqual: simplifiedList.length === maxAmount,
    length: simplifiedList.length,
  };
}

export async function checkFolder(
  folderPath: string,
  eventId: string,
  eventPassId: string,
  maxAmount: number
) {
  const folder = new FolderWrapper();

  const list = await folder.listFolder({
    accountId: env.UPLOAD_ACCOUNT_ID,
    folderPath: folderPath,
  });
  revalidatePath('/fr/Dashboard');

  const simplifiedList = list.items
    .map((item) => {
      if (item.type === 'File') {
        return {
          path: item.filePath,
        };
      }
      return null;
    })
    .filter((item) => item !== null);

  if (simplifiedList.length !== maxAmount) {
    return false;
  }

  for (let i = 0; i < maxAmount; i++) {
    const tempPath = folderPath + `/${eventId}-${eventPassId}-${i}`;

    if (
      !simplifiedList.some(
        (item) => item !== null && item.path.startsWith(tempPath)
      )
    ) {
      return false;
    }
  }
  return true;
}

export async function renameFolderQrCodes(
  folderPath: string,
  eventId: string,
  eventPassId: string,
  maxAmount: number
) {
  const folder = new FolderWrapper();
  const upload = new FileWrapper();

  const list = await folder.listFolder({
    accountId: env.UPLOAD_ACCOUNT_ID,
    folderPath: folderPath,
  });
  revalidatePath('/fr/Dashboard');

  let i = 0;

  const simplifiedList = list.items
    .map((item) => {
      if (item.type === 'File') {
        const result = {
          source: item.filePath,
          destination:
            folderPath +
            `/${eventId}-${eventPassId}-${i}.${item.fileUrl.split('.').pop()}`,
        };
        i += 1;
        return result;
      }
      return null;
    })
    .filter((item) => item !== null);

  if (simplifiedList.length !== maxAmount) {
    return `Error : The amount of files is ${simplifiedList.length} but should be ${maxAmount}`;
  }

  if (simplifiedList === null || simplifiedList.length === 0) {
    return 'Error : Folder is empty';
  }

  const nonNullSimplifiedList = simplifiedList.filter(
    (item): item is { source: string; destination: string } => item !== null
  );

  await upload.copyFileBatch({
    accountId: env.UPLOAD_ACCOUNT_ID,
    copyFileBatchRequest: {
      files: nonNullSimplifiedList,
    },
  });

  const oldFiles = nonNullSimplifiedList.map((item) => item.source);
  await upload.deleteFileBatch({
    accountId: env.UPLOAD_ACCOUNT_ID,
    deleteFileBatchRequest: {
      files: oldFiles,
    },
  });
  return 'All files have been renamed.';
}
