import {
  applySeeds,
  createDbClient,
  deleteAllTables,
  type PgClient,
} from '@test-utils/db';
import { accounts } from '@test-utils/gql';
import { getAccount } from './getAccount';

describe('getAccount test', () => {
  let client: PgClient;
  beforeAll(async () => {
    client = await createDbClient();
  });
  afterAll(async () => {
    await deleteAllTables(client);
    await client.end();
  });
  beforeEach(async () => {
    await deleteAllTables(client);
    await applySeeds(client, ['account', 'kyc']);
  });
  it('should throw an error when account does not exist', async () => {
    const nonExistingAddress = '0xNotExisting';
    const account = await getAccount(nonExistingAddress);
    expect(account).toBeNull();
  });
  it('should get an existing account by address', async () => {
    const fetchedAccount = await getAccount(accounts.beta_user.address);
    expect(fetchedAccount).not.toBeNull();
    expect(fetchedAccount.address).toEqual(accounts.beta_user.address);
  });
  it('should get an existing account with address in lowercase', async () => {
    const fetchedAccount = await getAccount(
      accounts.delta_user.address.toLowerCase(),
    );
    expect(fetchedAccount).not.toBeNull();
    expect(fetchedAccount.address).toEqual(accounts.delta_user.address);
    expect(fetchedAccount.kyc).toBeNull();
  });
  it('should get an existing account with kyc info if existing', async () => {
    const fetchedAccount = await getAccount(accounts.alpha_user.address);
    expect(fetchedAccount).not.toBeNull();
    expect(fetchedAccount.address).toEqual(accounts.alpha_user.address);
    expect(fetchedAccount.kyc).not.toBeNull();
    expect(fetchedAccount.kyc?.levelName).toEqual(
      accounts.alpha_user.kyc?.levelName,
    );
    expect(fetchedAccount.kyc?.reviewStatus).toEqual(
      accounts.alpha_user.kyc?.reviewStatus,
    );
  });
});
