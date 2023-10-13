import {
  applySeeds,
  createDbClient,
  deleteAllTables,
  type PgClient,
} from '@test-utils/db';
import { accounts } from '@test-utils/gql';
import { createAccount } from './createAccount';
import { getAccount } from './getAccount';

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
    await deleteAllTables(client);
    await client.end();
  });
  beforeEach(async () => {
    await deleteAllTables(client);
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
  it('should get an existing account with kyc info if existing', async () => {
    await applySeeds(client, ['account', 'kyc']);
    const fetchedAccount = await getAccount(accounts.alpha_user.address);
    expect(fetchedAccount).not.toBeNull();
    expect(fetchedAccount.address).toEqual(accounts.alpha_user.address);
    expect(fetchedAccount.email).toEqual(accounts.alpha_user.email);
    expect(fetchedAccount.kyc).not.toBeNull();
    expect(fetchedAccount.kyc?.levelName).toEqual(
      accounts.alpha_user.kyc?.levelName,
    );
    expect(fetchedAccount.kyc?.reviewStatus).toEqual(
      accounts.alpha_user.kyc?.reviewStatus,
    );
  });
});
