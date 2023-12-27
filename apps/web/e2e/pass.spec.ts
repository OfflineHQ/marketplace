import * as Bytescale from '@bytescale/sdk';
import { expect, test } from '@playwright/test';
import {
  PgClient,
  applySeeds,
  createDbClient,
  deleteAllTables,
} from 'libs/test-utils/db/src/index';
import { loadAccount } from './utils/loadAccount';

let client: PgClient;

test.beforeAll(async () => {
  client = await createDbClient();
  await deleteAllTables(client);
});

test.afterAll(async () => {
  await client.end();

  const filePath =
    '/local/users/0xB98bD7C7f656290071E52D1aA617D9cB4467Fd6D/clizzky8kap2t0bw7wka9a2id/events/clizzpvidao620buvxit1ynko/clj8raobj7g8l0aw3bfw6dny4/clizzpvidao620buvxit1ynko-clj8raobj7g8l0aw3bfw6dny4-1234124.png';
  const fileApi = new Bytescale.FileApi({
    apiKey: process.env.UPLOAD_SECRET_API_KEY || '',
  });

  await fileApi.deleteFile({
    accountId: process.env.UPLOAD_ACCOUNT_ID || '',
    filePath: filePath,
  });
});

test.afterEach(async () => {
  await deleteAllTables(client);
});

test.beforeEach(async () => {
  await applySeeds(client, [
    'account',
    'kyc',
    'passAmount',
    'passPricing',
    'eventPassNftContract',
    'eventPassNft',
    'eventParameters',
    'eventPassOrder',
  ]);
});
test('user should be able to download and reveal his pass', async () => {
  const { page, account } = await loadAccount({ user: 'alpha_user' });
  await page.getByRole('link', { name: 'Qr Code Pass' }).click();
  await page.getByRole('tab', { name: 'Past' }).click();
  await expect(page.getByText('Pass #12,432Revealed')).toBeVisible();
  await expect(page.getByText('Pass #1,234,124Not revealed')).toBeVisible();
  await page
    .getByRole('button', { name: 'Download Download 2 passes' })
    .click();
  await page.getByRole('button', { name: 'Reveal Yes, reveal it' }).click();
  await page.getByRole('button', { name: 'Menu Actions' }).nth(1).click();
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('link', { name: 'Download Download' }).click();
  const download = await downloadPromise;
  await expect(page.getByText('Pass downloaded').nth(1)).toBeVisible();
  await expect(
    page.getByText('The pass has been downloaded').nth(1),
  ).toBeVisible();
  const downloadFilename = download.suggestedFilename();
  expect(downloadFilename).toEqual('test-an-event-vip-12432.png');
  expect(await download.failure()).toBeFalsy();
  await page.reload();
  await expect(page.getByText('Pass #1,234,124Revealed')).toBeVisible();
});
