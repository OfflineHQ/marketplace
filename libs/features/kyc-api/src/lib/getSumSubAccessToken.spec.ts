import { Kyc } from '@kyc/admin';
import { getCurrentUser } from '@next/next-auth/user';
import { accounts } from '@test-utils/gql';
import { getAccountKyc } from './getAccountKyc';
import { getSumSubAccessToken } from './getSumSubAccessToken';

jest.mock('@next/next-auth/user', () => ({
  getCurrentUser: jest.fn(),
}));
jest.mock('@kyc/admin');
jest.mock('./getAccountKyc', () => ({
  getAccountKyc: jest.fn(),
}));
jest.mock('@kyc/admin');

(Kyc.prototype.getAccessToken as jest.Mock).mockResolvedValue('test-token');

describe('getSumSubAccessToken', () => {
  it('should return an access token', async () => {
    // Mock the user and Kyc class
    (getCurrentUser as jest.Mock).mockResolvedValue(accounts.alpha_user);
    (getAccountKyc as jest.Mock).mockResolvedValue(null);

    const token = await getSumSubAccessToken();

    expect(Kyc.prototype.getAccessToken as jest.Mock).toHaveBeenCalledWith({
      userId: accounts.alpha_user.id,
      levelName: accounts.alpha_user.kyc.levelName,
    });

    expect(token).toEqual('test-token');
  });

  it('should return an access token if user has no kyc in session but has an applicantId', async () => {
    const userWithoutKyc = {
      ...accounts.alpha_user,
      kyc: null,
    };
    (getCurrentUser as jest.Mock).mockResolvedValue(userWithoutKyc);
    (getAccountKyc as jest.Mock).mockResolvedValue(accounts.alpha_user.kyc);
    const token = await getSumSubAccessToken();

    expect(Kyc.prototype.getAccessToken as jest.Mock).toHaveBeenCalledWith({
      userId: userWithoutKyc.id,
      levelName: accounts.alpha_user.kyc.levelName,
    });

    expect(token).toEqual('test-token');
  });

  it('should throw an error if user is not logged in', async () => {
    (getCurrentUser as jest.Mock).mockResolvedValue(null);

    await expect(getSumSubAccessToken()).rejects.toThrow();
  });

  it('should throw an error if user has no applicantId', async () => {
    (getCurrentUser as jest.Mock).mockResolvedValue({
      ...accounts.alpha_user,
      kyc: null,
    });
    (getAccountKyc as jest.Mock).mockResolvedValue(null);
    await expect(getSumSubAccessToken()).rejects.toThrow();
  });
});
