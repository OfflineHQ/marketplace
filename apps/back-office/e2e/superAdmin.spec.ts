import { Roles_Enum } from '@gql/shared/types';
import { expect, test } from '@playwright/test';
import { resetCache } from '@test-utils/cache';
import {
  PgClient,
  applySeeds,
  createDbClient,
  deleteAllTables,
} from '@test-utils/db';
import { loadAccountAndRole } from './utils/loadAccountAndRole';

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
    'eventPassNftContract',
    'eventParameters',
    'roleAssignment',
  ]);
});

test('super admin should be able to view events', async () => {
  const { page } = await loadAccountAndRole({
    user: 'alpha_user',
    goTo: '/en',
    role: Roles_Enum.OrganizerSuperAdmin,
  });
  await page.getByRole('link', { name: /events management/i }).click();
  await expect(page.getByText(/an event/i)).toBeVisible();
  await expect(page.getByText(/test-an-event/i)).toBeVisible();
  await expect(
    page.getByRole('heading', { name: /events management/i }),
  ).toBeVisible();
  await expect(page.getByText(/^anniversaire$/i)).toBeVisible();
  await expect(page.getByText(/test-anniversaire/i)).toBeVisible();
  await page
    .getByRole('row', { name: /an event test-an-event/i })
    .getByRole('button')
    .click();
  await page.getByRole('link', { name: /edit edit/i }).click();
  await expect(page.getByRole('heading', { name: /an event/i })).toBeVisible();
  await expect(page.getByRole('heading', { name: /gold/i })).toBeVisible();
  await expect(page.getByRole('heading', { name: /vip/i })).toBeVisible();
  await expect(page.getByText(/pass vip pour le match/i)).toBeVisible();
  await expect(page.getByText(/pass gold pour le match/i)).toBeVisible();
  await page
    .getByRole('button', { name: /pass associated to your nfts/i })
    .first()
    .click();
  await expect(
    page.getByRole('button', { name: /deploy the nfts contract/i }).first(),
  ).toBeVisible();
  await expect(
    page.locator('span').filter({ hasText: '0xfake***ddress1' }).first(),
  ).toBeVisible();
  await page.getByTestId('sheet-back').click();
  await expect(
    page.getByRole('heading', { name: /events management/i }),
  ).toBeVisible();
});
