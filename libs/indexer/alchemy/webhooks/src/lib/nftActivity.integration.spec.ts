import {
  deleteAccounts,
  createDbClient,
  deleteTables,
  seedDb,
  type PgClient,
  deleteAllTables,
  applySeeds,
} from '@test-utils/db';
import { nftActivity } from './nftActivity';

describe('nftActivity integration test', () => {
  let client: PgClient;
  beforeAll(async () => {
    client = await createDbClient();
    await deleteAllTables(client);
    await applySeeds(client, [
      'account',
      'eventPassNftContract',
      'eventParameters',
      'eventPassNft',
    ]);
    await seedDb(client, 'account');
  });
  afterAll(async () => {
    await deleteAllTables(client);
    await client.end();
  });

  // beforeEach(async () => {});

  it('should create account', async () => {
    // const account = {
    // 	address: '0x123',
    // 	email: '
  });
});
