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
  await page.getByRole('link', { name: 'Events Management' }).click();
  await expect(page.getByText('An event')).toBeVisible();
  await expect(page.getByText('test-an-event')).toBeVisible();
  await expect(
    page.getByRole('heading', { name: 'Events Management' }),
  ).toBeVisible();
  await expect(page.getByText('Anniversaire', { exact: true })).toBeVisible();
  await expect(page.getByText('test-anniversaire')).toBeVisible();
  await page
    .getByRole('row', { name: 'An event test-an-event' })
    .getByRole('button')
    .click();
  await page.getByRole('link', { name: 'Edit Edit' }).click();
  await expect(page.getByRole('heading', { name: 'An event' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Gold' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'VIP' })).toBeVisible();
  await expect(page.getByText('Pass vip pour le match')).toBeVisible();
  await expect(page.getByText('Pass gold pour le match')).toBeVisible();
  await page
    .getByRole('button', { name: 'Pass associated to your NFTs' })
    .first()
    .click();
  await expect(
    page.getByRole('button', { name: 'Deploy the NFTs contract' }).first(),
  ).toBeVisible();
  await expect(
    page.locator('span').filter({ hasText: '0xfake***ddress1' }).first(),
  ).toBeVisible();
  await page.getByTestId('sheet-back').click();
  await expect(
    page.getByRole('heading', { name: 'Events Management' }),
  ).toBeVisible();
});
