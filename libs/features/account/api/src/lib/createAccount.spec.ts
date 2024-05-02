import {
  createDbClient,
  deleteTables,
  seedDb,
  type PgClient,
} from '@test-utils/db';
import { ethers } from 'ethers';
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

  const account = {
    address: '0x1bBedb07706728a19c9DB82d3c420670D8040592',
  };

  it('should create account', async () => {
    const data = await createAccount(account);
    expect(data.address).toEqual(account.address);
    expect(data.id).toBeDefined();
  });

  it('should throw an error when address already exists', async () => {
    const account2 = {
      address: account.address,
    };
    await createAccount(account);
    await expect(createAccount(account2)).rejects.toThrow();
  });
  it('should throw an error when address is not provided', async () => {
    await expect(createAccount({} as any)).rejects.toThrow();
  });

  it('should create an account with address in any case and return normalized address', async () => {
    const mixedCaseAddress = '0x1bBedb07706728a19c9DB82d3c420670D8040592';
    const accountWithMixedCase = {
      address: mixedCaseAddress,
    };
    const data = await createAccount(accountWithMixedCase);
    expect(data.address).toEqual(ethers.utils.getAddress(mixedCaseAddress));
    expect(data.id).toBeDefined();
  });
});
