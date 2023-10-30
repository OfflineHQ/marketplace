import { userSdk } from '@gql/user/api';
import { getCurrentUser } from '@next/next-auth/user';
import { getEventPassOrdersConfirmed } from './getEventPassOrdersConfirmed';

jest.mock('@next/next-auth/user');

jest.mock('@gql/user/api', () => ({
  userSdk: {
    GetEventPassOrdersConfirmed: jest.fn().mockResolvedValue({
      eventPassOrder: [{ id: 'test-order' }],
    }),
  },
}));

describe('getEventPassOrdersConfirmed', () => {
  it('should return null if user is not authenticated', async () => {
    (getCurrentUser as jest.Mock).mockResolvedValue(null);

    const result = await getEventPassOrdersConfirmed();

    expect(result).toBeNull();
  });

  it('should return event pass orders confirmed if user is authenticated', async () => {
    const mockUser = { id: 'test-user' };
    (getCurrentUser as jest.Mock).mockResolvedValue(mockUser);

    const result = await getEventPassOrdersConfirmed();

    expect(result).toEqual([{ id: 'test-order' }]);
    expect(userSdk.GetEventPassOrdersConfirmed).toHaveBeenCalledWith(
      {},
      {
        next: {
          tags: ['GetEventPassOrdersConfirmed'],
        },
      },
    );
  });
});
