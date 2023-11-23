import { expect, test } from '@playwright/test';
import { accounts } from '@test-utils/gql';
import {
  PgClient,
  applySeeds,
  createDbClient,
  deleteAllTables,
} from 'libs/test-utils/db/src/index';
import { loadUser } from './utils/loadUser';

let client: PgClient;

test.beforeAll(async () => {
  client = await createDbClient();
});

test.afterAll(async () => {
  await client.end();
});

test.afterEach(async () => {
  await deleteAllTables(client);
});

test.beforeEach(async () => {
  await applySeeds(client, ['account', 'kyc', 'eventPassPricing']);
});

test.setTimeout(120000);

test.use({
  storageState: 'apps/web/e2e/utils/alpha_user.json',
});

test('user should be able to buy a pass', async ({ page }) => {
  await loadUser(page, accounts.alpha_user, 'Alpha User');
  await page.goto('/en');
  await new Promise((resolve) => setTimeout(resolve, 15000));
  await expect(
    page.getByRole('button', { name: 'alpha_user@test.io', exact: true }),
  ).toBeVisible();

  await page.goto('/en/organizer/test/event/test-an-event');
  await expect(page.getByRole('img', { name: 'An event' })).toBeVisible();
  await expect(page.getByText('Wed, Jun 28, 2023, 2:08 PM')).toBeVisible();
  await expect(page.getByText('Thu, Jun 22, 2023, 8:40 PM')).toBeVisible();
  await page
    .getByRole('button', { name: 'Qr Code Select passes' })
    .first()
    .click();
  await new Promise((resolve) => setTimeout(resolve, 7000));
  await page
    .locator('div')
    .filter({ hasText: /^€82\.500$/ })
    .getByLabel('increment value')
    .click();
  await new Promise((resolve) => setTimeout(resolve, 5000));
  await expect(page.getByText('1 pass selected')).toBeVisible();
  await expect(
    page.getByRole('heading', { name: 'Total Price: €82.50' }),
  ).toBeVisible();
  await page.getByRole('button', { name: 'Go to payment' }).click();
  await new Promise((resolve) => setTimeout(resolve, 7000));
  await page.getByRole('button', { name: 'Proceed to payment' }).click();
  await new Promise((resolve) => setTimeout(resolve, 14000));
  const url = page.url();
  expect(url).toMatch(/checkout.stripe.com\/c\/pay/);
});
