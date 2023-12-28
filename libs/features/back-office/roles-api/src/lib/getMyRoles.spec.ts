import { userSdk } from '@gql/user/api';
import { isConnected } from '@next/next-auth/user';
import { backOfficeAccounts } from '@test-utils/gql';
import { getMyRoles } from './getMyRoles';

jest.mock('@gql/user/api');
jest.mock('@next/next-auth/user', () => {
  return {
    isConnected: jest.fn().mockReturnValue(true),
  };
});

describe('GetMyRoles', () => {
  const userSdkMock = jest.spyOn(userSdk, 'GetMyRoles').mockResolvedValue({
    roleAssignment: [backOfficeAccounts.alpha_organizer_super_admin_user.role],
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });
  // Function returns role assignments when user is connected and data is available
  it('should return role assignments when user is connected and data is available', async () => {
    const result = await getMyRoles();

    expect(isConnected as jest.Mock).toHaveBeenCalled();
    expect(userSdkMock).toHaveBeenCalled();
    expect(result).toEqual([
      backOfficeAccounts.alpha_organizer_super_admin_user.role,
    ]);
  });

  // Function throws an error when user is not connected
  it('should throw an error when user is not connected', async () => {
    (isConnected as jest.Mock).mockReturnValueOnce(false);
    await expect(getMyRoles()).rejects.toThrow('User not connected');
  });
});
