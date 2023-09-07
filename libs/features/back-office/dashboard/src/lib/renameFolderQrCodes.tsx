'use server';

import { FileWrapper, FolderWrapper } from '@file-upload/admin';
import { revalidatePath } from 'next/cache';

export async function renameFolderQrCodes(
  folderPath: string,
  eventId: string,
  eventPassId: string
) {
  revalidatePath('/');
  const folder = new FolderWrapper();
  const upload = new FileWrapper();

  const list = await folder.listFolder({
    accountId: 'FW25bfk',
    folderPath: folderPath,
  });
  console.log(list);

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

  console.log(simplifiedList);

  if (simplifiedList === null || simplifiedList.length === 0) {
    return;
  }

  const nonNullSimplifiedList = simplifiedList.filter(
    (item): item is { source: string; destination: string } => item !== null
  );

  console.log(nonNullSimplifiedList);
  await upload.copyFileBatch({
    accountId: 'FW25bfk',
    copyFileBatchRequest: {
      files: nonNullSimplifiedList,
    },
  });

  const oldFiles = nonNullSimplifiedList.map((item) => item.source);
  console.log(oldFiles);
  await upload.deleteFileBatch({
    accountId: 'FW25bfk',
    deleteFileBatchRequest: {
      files: oldFiles,
    },
  });
}
