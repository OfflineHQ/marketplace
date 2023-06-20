import { getAccount } from './getAccount';
import { createAccount } from './createAccount';
import { deleteAccounts } from '@test-utils/db';

describe('getAccount test', () => {
  const account = {
    address: '0x123',
    email: 'test@safsaf.safsaf',
  };
  beforeAll(async () => {
    await deleteAccounts();
  });
  afterAll(async () => {
    // Clean up after each test
    await deleteAccounts();
  });

  it('should get an account by address', async () => {
    await createAccount(account);
    const fetchedAccount = await getAccount(account.address);
    expect(fetchedAccount).not.toBeNull();
    expect(fetchedAccount.address).toEqual(account.address);
    expect(fetchedAccount.email).toEqual(account.email);
  });

  it('should return null when account does not exist', async () => {
    const nonExistingAddress = '0x124';
    const fetchedAccount = await getAccount(nonExistingAddress);
    expect(fetchedAccount).toBeNull();
  });
});
