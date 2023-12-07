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
    'eventPassPricing',
    'eventPassNftContract',
    'eventParameters',
    'roleAssignments',
  ]);
});

test('super admin should be able to view events', async () => {
  const { page } = await loadAccountAndRole({
    user: 'alpha_user',
    goTo: '/fr',
    role: 'Test Super Admin',
  });
  await page
    .getByRole('link', { name: 'Event Management Gestion des' })
    .click();
  await expect(page.getByText('An event')).toBeVisible();
  await expect(page.getByText('test-an-event')).toBeVisible();
  await expect(
    page.getByRole('heading', { name: 'Gestion des événements' }),
  ).toBeVisible();
  await expect(page.getByText('Anniversaire', { exact: true })).toBeVisible();
  await expect(page.getByText('test-anniversaire')).toBeVisible();
  await page
    .getByRole('row', { name: 'An event test-an-event' })
    .getByRole('button')
    .click();
  await page.getByRole('link', { name: 'Edit Éditer' }).click();
  await page.goto('http://localhost:1789/fr/events/test-an-event');
  await page
    .getByRole('button', { name: 'Informations sur les NFTs' })
    .nth(1)
    .click();
  await expect(page.getByRole('heading', { name: 'An event' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Gold' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'VIP' })).toBeVisible();
  await expect(page.getByText('Pass vip pour le match')).toBeVisible();
  await expect(page.getByText('Pass gold pour le match')).toBeVisible();
  await expect(page.getByText('NomDefault name for NFT').first()).toBeVisible();
  await expect(page.getByText('DescriptionDefault NFT').first()).toBeVisible();
  await expect(page.getByText('Quantitée20').first()).toBeVisible();
  await expect(page.getByText('1', { exact: true })).toBeVisible();
  await expect(page.getByText('Quantitée par utilisateur1')).toBeVisible();
  await page
    .getByRole('button', { name: 'Pass associés à vos NFTs' })
    .first()
    .click();
  await expect(
    page
      .getByRole('cell', {
        name: '/local/organizers/clizzky8kap2t0bw7wka9a2id/events/clizzpvidao620buvxit1ynko/clkr1vpdhnqg80bw2ckil7ytq/clizzpvidao620buvxit1ynko-clkr1vpdhnqg80bw2ckil7ytq-0.jpg',
        exact: true,
      })
      .locator('span'),
  ).toBeVisible();
  await expect(
    page.getByRole('button', { name: 'Déployer le contrat NFTs' }).first(),
  ).toBeVisible();
  await expect(
    page.locator('span').filter({ hasText: '0xfake***ddress1' }).first(),
  ).toBeVisible();
  await page.getByTestId('sheet-back').click();
  await expect(
    page.getByRole('heading', { name: 'Gestion des événements' }),
  ).toBeVisible();
});
