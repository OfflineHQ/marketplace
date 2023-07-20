import {
  deleteAccounts,
  createDbClient,
  seedDb,
  type PgClient,
} from '@test-utils/db';
import { createAccount } from './createAccount';

describe('createAccount test', () => {
  let client: PgClient;
  beforeAll(async () => {
    client = await createDbClient();
  });
  afterAll(async () => {
    await deleteAccounts(client);
    await client.end();
  });

  beforeEach(async () => {
    await deleteAccounts(client);
    await seedDb(client, './hasura/app/seeds/default/account.sql');
  });

  it('should create account', async () => {
    const account = {
      address: '0x123',
      email: 'test@safsaf.safsaf',
    };
    const data = await createAccount(account);
    expect(data.address).toEqual(account.address);
    expect(data.email).toEqual(account.email);
    expect(data.id).toBeDefined();
  });

  it('should throw an error when address already exists', async () => {
    const account1 = {
      address: '0x123',
      email: 'test1@safsaf.safsaf',
    };
    const account2 = {
      address: '0x123',
      email: 'test2@safsaf.safsaf',
    };
    await createAccount(account1);
    await expect(createAccount(account2)).rejects.toThrow();
  });
  it('should throw an error when address is not provided', async () => {
    const account = {
      email: 'test@safsaf.safsaf',
    };
    await expect(createAccount(account as any)).rejects.toThrow();
  });
  it("shouldn't throw an error when email already exists", async () => {
    const account1 = {
      address: '0x123',
      email: 'test@safsaf.safsaf',
    };
    const account2 = {
      address: '0x124',
      email: 'test@safsaf.safsaf',
    };
    const _account1 = await createAccount(account1);
    const _account2 = await createAccount(account2);
    expect(_account1.email).toEqual(account1.email);
    expect(_account2.email).toEqual(account2.email);
  });

  it('should create account without email', async () => {
    const account = {
      address: '0x123',
    };
    const data = await createAccount(account);
    expect(data.address).toEqual(account.address);
    expect(data.email).toBeNull();
    expect(data.id).toBeDefined();
  });
});
