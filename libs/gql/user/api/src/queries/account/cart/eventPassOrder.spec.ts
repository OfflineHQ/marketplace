import {
  alphaAdminClient,
  betaAdminClient,
  sebGoogleClient,
} from '@test-utils/gql';
import {
  deleteAccounts,
  seedDb,
  createDbClient,
  deleteTables,
  type PgClient,
} from '@test-utils/db';

describe('test for eventPassOrder', () => {
  let client: PgClient;
  const eventPass = {
    eventPassId: 'fake-event-pass-1',
  };
  const eventPass2 = {
    eventPassId: 'fake-event-pass-2',
  };
  const alphaAdmin = alphaAdminClient();
  const betaAdmin = betaAdminClient();
  const sebGoogle = sebGoogleClient();

  beforeAll(async () => {
    client = await createDbClient();
    await deleteAccounts(client);
    await deleteTables(client, '"eventPassOrder", "eventPassPricing"');
    await seedDb(client, './tools/test/seeds/account.sql');
    await seedDb(client, './tools/test/seeds/eventPassPricing.sql');
  });
  afterAll(async () => {
    await deleteAccounts(client);
    await deleteTables(client, '"eventPassOrder", "eventPassPricing"');
    await client.end();
  });
  afterEach(async () => {
    await deleteTables(client, '"eventPassOrder"');
  });
});
