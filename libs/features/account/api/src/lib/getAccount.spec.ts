import { getAccount } from './getAccount';
import { createAccount } from './createAccount';
import {
  deleteAccounts,
  createDbClient,
  seedDb,
  type PgClient,
} from '@test-utils/db';

describe('getAccount test', () => {
  let client: PgClient;
  const account = {
    address: '0x9203',
    email: 'test@safsaf.safsaf',
  };
  beforeAll(async () => {
    client = await createDbClient();
  });
  afterAll(async () => {
    await deleteAccounts(client);
    await client.end();
  });
  beforeEach(async () => {
    await deleteAccounts(client);
    await seedDb(client, './hasura/app/seeds/default/0_account.sql');
  });
  it('should return null when account does not exist', async () => {
    const nonExistingAddress = '0xNotExisting';
    const fetchedAccount = await getAccount(nonExistingAddress);
    expect(fetchedAccount).toBeNull();
  });
  it('should get an account by address', async () => {
    const createdAccount = await createAccount(account);
    const fetchedAccount = await getAccount(createdAccount.address);
    expect(fetchedAccount).not.toBeNull();
    expect(fetchedAccount.address).toEqual(account.address);
    expect(fetchedAccount.email).toEqual(account.email);
  });
});
