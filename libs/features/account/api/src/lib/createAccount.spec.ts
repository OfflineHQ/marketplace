import {
  createDbClient,
  deleteTables,
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
    await deleteTables(client, ['account']);
    await client.end();
  });

  beforeEach(async () => {
    await deleteTables(client, ['account']);
    await seedDb(client, 'account');
  });

  it('should create account', async () => {
    const account = {
      address: '0x123',
    };
    const data = await createAccount(account);
    expect(data.address).toEqual(account.address);
    expect(data.id).toBeDefined();
  });

  it('should throw an error when address already exists', async () => {
    const account1 = {
      address: '0x123',
    };
    const account2 = {
      address: '0x123',
    };
    await createAccount(account1);
    await expect(createAccount(account2)).rejects.toThrow();
  });
  it('should throw an error when address is not provided', async () => {
    const account = {};
    await expect(createAccount(account as any)).rejects.toThrow();
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
