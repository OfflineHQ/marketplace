import { getAccount } from './getAccount';
import { createAccount } from './createAccount';
import { handleAccount } from './handleAccount';

jest.mock('./getAccount');
jest.mock('./createAccount');

describe('handleAccount test', () => {
  const account = {
    id: 'some-unique-id',
    address: '0x123',
    email: 'test@safsaf.safsaf',
    emailVerified: false,
    roles: null,
  };

  afterEach(async () => {
    // Clean up after each test
    jest.resetAllMocks();
  });

  it('should create account when it does not exist', async () => {
    (
      getAccount as jest.MockedFunction<typeof getAccount>
    ).mockResolvedValueOnce(null);
    (
      createAccount as jest.MockedFunction<typeof createAccount>
    ).mockResolvedValueOnce(account);
    const result = await handleAccount(account);
    expect(result).toEqual(account);
    expect(createAccount).toHaveBeenCalledTimes(1);
    expect(createAccount).toHaveBeenCalledWith(account);
  });

  it('should return existing account without creating new one', async () => {
    (
      getAccount as jest.MockedFunction<typeof getAccount>
    ).mockResolvedValueOnce(account);
    const result = await handleAccount(account);
    expect(result).toEqual(account);
    expect(createAccount).not.toHaveBeenCalled();
  });

  it('should throw error when getAccount throws error', async () => {
    const error = new Error('Failed to get account');
    (
      getAccount as jest.MockedFunction<typeof getAccount>
    ).mockRejectedValueOnce(error);
    await expect(handleAccount(account)).rejects.toThrow(error);
    expect(createAccount).not.toHaveBeenCalled();
  });

  it('should throw error when createAccount throws error', async () => {
    const error = new Error('Failed to create account');
    (
      getAccount as jest.MockedFunction<typeof getAccount>
    ).mockResolvedValueOnce(null);
    (
      createAccount as jest.MockedFunction<typeof createAccount>
    ).mockRejectedValueOnce(error);
    await expect(handleAccount(account)).rejects.toThrow(error);
  });
});
