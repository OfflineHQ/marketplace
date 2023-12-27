import { userSdk } from '@gql/user/api';
import { getCurrentUser } from '@next/next-auth/user';
import { getOrdersConfirmed } from './getOrdersConfirmed';

jest.mock('@next/next-auth/user');

jest.mock('@gql/user/api', () => ({
  userSdk: {
    GetOrdersConfirmed: jest.fn().mockResolvedValue({
      eventPassOrder: [{ id: 'test-order' }],
    }),
  },
}));

describe('getOrdersConfirmed', () => {
  it('should return null if user is not authenticated', async () => {
    (getCurrentUser as jest.Mock).mockResolvedValue(null);

    const result = await getOrdersConfirmed();

    expect(result).toBeNull();
  });

  it('should return event pass orders confirmed if user is authenticated', async () => {
    const mockUser = { id: 'test-user' };
    (getCurrentUser as jest.Mock).mockResolvedValue(mockUser);

    const result = await getOrdersConfirmed();

    expect(result).toEqual([{ id: 'test-order' }]);
    expect(userSdk.GetOrdersConfirmed).toHaveBeenCalledWith(
      {},
      {
        next: {
          tags: ['GetOrdersConfirmed'],
        },
      },
    );
  });
});
