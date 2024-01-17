import { expect, test } from '@playwright/test';
import { resetCache } from '@test-utils/cache';
import {
  PgClient,
  applySeeds,
  createDbClient,
  deleteAllTables,
  updateObjects,
} from '@test-utils/db';
import { loadAccount } from './utils/loadAccount';

let client: PgClient;

test.beforeAll(async () => {
  client = await createDbClient();
  await deleteAllTables(client);
  await resetCache();
});

test.afterAll(async () => {
  await client.end();
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
    'eventParameters',
  ]);
  const currentDate = new Date();
  // set the event to be isSaleOnGoing = true
  await updateObjects(
    client,
    'eventParameters',
    {
      dateSaleStart: new Date(currentDate.getTime() - 2000 * 60 * 60), // 2 hours before
      dateSaleEnd: new Date(currentDate.getTime() + 2000 * 60 * 60), // 2 hours after
    },
    { eventId: 'clizzpvidao620buvxit1ynko' },
  );
});

test('user should be able to buy a pass', async () => {
  const { page } = await loadAccount({
    user: 'alpha_user',
    goTo: '/en/organizer/test/event/test-an-event',
  });
  await expect(page.getByRole('img', { name: /an event/i })).toBeVisible();
  await expect(page.getByText(/wed, jun 28, 2023, 2:08 pm/i)).toBeVisible();
  await expect(page.getByText(/thu, jun 22, 2023, 8:40 pm/i)).toBeVisible();
  await page
    .getByRole('button', { name: /qr code select passes/i })
    .first()
    .click();
  await page
    .locator('div')
    .filter({ hasText: /^€82\.500$/i })
    .getByLabel(/increment value/i)
    .click();
  await expect(page.getByText(/1 pass selected/i)).toBeVisible();
  await expect(
    page.getByRole('heading', { name: /total price: €82.50/i }),
  ).toBeVisible();
  await page.getByRole('button', { name: /go to payment/i }).click();
  await page.getByRole('button', { name: /proceed to payment/i }).click();
  await page.waitForURL(/checkout.stripe.com\/c\/pay/i);
  await page.getByLabel(/back/i).click();
  await expect(page.getByText(/purchase cancelled/i)).toBeVisible();
});
