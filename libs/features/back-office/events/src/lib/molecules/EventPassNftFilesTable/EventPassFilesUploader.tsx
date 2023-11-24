'use client';

import { UploadDropzone } from '@bytescale/upload-widget-react';

import env from '@env/client';

import * as Bytescale from '@bytescale/sdk';
import { getNextAppURL } from '@shared/client';

export type EventPassNftFilesTableProps = GetEventPassNftFilesProps;

export async function EventPassNftFilesUploader({
  eventPass,
  ...props
}: EventPassNftFilesTableProps) {
  await Bytescale.AuthManager.beginAuthSession({
    accountId: env.NEXT_PUBLIC_UPLOAD_ACCOUNT_ID,
    authUrl: `${getNextAppURL()}/api/bytescale/jwt`,
    authHeaders: async () => Promise.resolve({}),
  });
  return null;
}
