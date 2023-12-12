'use server';

import env from '@env/server';
import { FileWrapper, FolderWrapper } from '@file-upload/admin';
import { revalidatePath } from 'next/cache';

interface CheckFolderLengthProps {
  folderPath: string;
  maxAmount: number;
}

export async function checkFolderLength({
  folderPath,
  maxAmount,
}: CheckFolderLengthProps) {
  const folder = new FolderWrapper();

  const list = await folder.listFolder({
    accountId: env.UPLOAD_ACCOUNT_ID,
    folderPath: folderPath,
  });
  revalidatePath('/[locale]/events', 'page');

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

interface CheckFolderProps extends CheckFolderLengthProps {
  eventId: string;
  eventPassId: string;
}

export async function checkFolder({
  folderPath,
  eventId,
  eventPassId,
  maxAmount,
}: CheckFolderProps) {
  const folder = new FolderWrapper();

  const list = await folder.listFolder({
    accountId: env.UPLOAD_ACCOUNT_ID,
    folderPath: folderPath,
  });
  revalidatePath('/[locale]/events', 'page');

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
        (item) => item !== null && item.path.startsWith(tempPath),
      )
    ) {
      return false;
    }
  }
  return true;
}

type RenameFolderQrCodesProps = CheckFolderProps;

export async function renameFolderQrCodes({
  folderPath,
  eventId,
  eventPassId,
  maxAmount,
}: RenameFolderQrCodesProps) {
  const folder = new FolderWrapper();
  const upload = new FileWrapper();

  const list = await folder.listFolder({
    accountId: env.UPLOAD_ACCOUNT_ID,
    folderPath: folderPath,
  });
  revalidatePath('/[locale]/events', 'page');

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
    (item): item is { source: string; destination: string } => item !== null,
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
