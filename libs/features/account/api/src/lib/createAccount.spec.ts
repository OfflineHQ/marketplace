import { deleteAccounts } from '@test-utils/db';
import { createAccount } from './createAccount';

describe('createAccount test', () => {
  beforeEach(async () => {
    await deleteAccounts();
  });
  afterAll(async () => {
    await deleteAccounts();
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
});
