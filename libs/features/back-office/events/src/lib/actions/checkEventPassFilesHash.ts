'use server';
import env from '@env/server';
import { GetEventPassOrganizerFolderPath } from '@features/pass-common';
import { FileWrapper } from '@file-upload/admin';
import { cacheWithDynamicKeys } from '@next/cache';

import crypto from 'crypto';

export type CheckEventPassNftFilesHashProps =
  GetEventPassOrganizerFolderPath & {
    filesPath: string[];
  };

export const checkEventPassNftFilesHash = cacheWithDynamicKeys(
  async ({ filesPath }: CheckEventPassNftFilesHashProps) => {
    const fileWrapper = new FileWrapper();
    const filesContent = await Promise.all(
      filesPath.map((filePath) =>
        fileWrapper
          .downloadFile({
            accountId: env.UPLOAD_ACCOUNT_ID,
            filePath,
          })
          .then(async (response) => {
            const blob = await response.blob();
            const arrayBuffer = await blob.arrayBuffer();
            const hash = crypto
              .createHash('sha256')
              .update(Buffer.from(arrayBuffer))
              .digest('hex');
            return { hash, path: filePath };
          }),
      ),
    );
    const hashMap = new Map();
    for (const file of filesContent) {
      const existingFiles = hashMap.get(file.hash) || [];
      existingFiles.push(file.path);
      hashMap.set(file.hash, existingFiles);
    }
    return Array.from(hashMap.values()).filter((paths) => paths.length > 1);
  },
  (props: [CheckEventPassNftFilesHashProps]) => [
    `${props[0].organizerId}-${props[0].eventId}-${props[0].eventPassId}-getEventPassNftFiles`,
  ],
);

export type DuplicatesType = Array<Array<string>>;
