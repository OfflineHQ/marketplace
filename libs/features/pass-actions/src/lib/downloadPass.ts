'use server';

import { downloadPass as downloadPassApi } from '@features/pass-api';

export async function downloadPass(id: Parameters<typeof downloadPassApi>[0]) {
  await downloadPassApi(id);
}
