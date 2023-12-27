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
    'eventParameters',
    'roleAssignment',
  ]);
});

// eslint-disable-next-line playwright/expect-expect
test('human resources should not have access to events', async () => {
  const { page } = await loadAccountAndRole({
    user: 'alpha_user',
    goTo: '/en',
    role: Roles_Enum.OrganizerHumanResources,
  });
  await expect(page.getByRole('link', { name: 'Manage Roles' })).toBeVisible();
  await expect(
    page.getByRole('link', { name: 'Event Management' }),
  ).toBeHidden();
});
