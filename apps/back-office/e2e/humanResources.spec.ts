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
    'eventParameters',
    'roleAssignments',
  ]);
});

// eslint-disable-next-line playwright/expect-expect
test('human resources should not have access to events', async () => {
  const { page } = await loadAccountAndRole({
    user: 'alpha_user',
    goTo: '/fr',
    role: 'Ressources humaines',
  });
  await expect(
    page.getByRole('link', { name: 'Gérer les rôles' }),
  ).toBeVisible();
  await expect(
    page.getByRole('link', { name: 'Event Management Gestion des' }),
  ).toBeHidden();
});
