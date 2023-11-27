import * as Bytescale from '@bytescale/sdk';
import envServer from '@env/server';
import { getEventPassRevealedFilePath } from '@features/pass-api';
import { getCurrentUser } from '@next/next-auth/user';
import { NextRequest, NextResponse } from 'next/server';
import { parse } from 'url';

export async function GET(req: NextRequest) {
  if (!req.nextUrl.href) {
    return NextResponse.error();
  }

  const query = parse(req.nextUrl.href, true).query;
  const { id, tokenId, slug } = query;
  const user = await getCurrentUser();

  if (typeof id !== 'string') {
    return NextResponse.error();
  }

  const fileApi = new Bytescale.FileApi({
    fetchApi: fetch,
    apiKey: envServer.UPLOAD_SECRET_API_KEY,
  });

  const filePath = await getEventPassRevealedFilePath(id, user?.address);

  const fileData = await fileApi.downloadFile({
    accountId: envServer.UPLOAD_ACCOUNT_ID,
    filePath: filePath,
  });

  const file = await fileData.blob();

  return new NextResponse(file, {
    status: 200,
    headers: {
      'Content-Type': 'application/octet-stream',
      'Content-Disposition': `attachment; filename=${slug}-${tokenId}.png`,
    },
  });
}
