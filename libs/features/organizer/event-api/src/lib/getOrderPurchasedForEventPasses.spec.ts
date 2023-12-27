import { userSdk } from '@gql/user/api';
import { getCurrentUser } from '@next/next-auth/user';
import { getOrderPurchasedForEventPasses } from './getOrderPurchasedForEventPasses';

jest.mock('@next/next-auth/user');

jest.mock('@gql/user/api', () => ({
  userSdk: {
    GetOrderPurchasedForEventPassesIds: jest.fn().mockResolvedValue({
      order: [{ id: 'test-order' }],
    }),
  },
}));

describe('getOrderPurchasedForEventPasses', () => {
  const mockEventPassIds = ['test-pass1', 'test-pass2'];

  it('should return null if user is not authenticated', async () => {
    (getCurrentUser as jest.Mock).mockResolvedValue(null);

    const result = await getOrderPurchasedForEventPasses({
      eventPassIds: mockEventPassIds,
    });

    expect(result).toBeNull();
  });

  it('should return event pass orders confirmed or completed if user is authenticated', async () => {
    const mockUser = { id: 'test-user' };
    (getCurrentUser as jest.Mock).mockResolvedValue(mockUser);

    const result = await getOrderPurchasedForEventPasses({
      eventPassIds: mockEventPassIds,
    });

    expect(result).toEqual([{ id: 'test-order' }]);
    expect(userSdk.GetOrderPurchasedForEventPassesIds).toHaveBeenCalledWith(
      { eventPassIds: mockEventPassIds },
      {
        next: {
          tags: ['GetOrderPurchasedForEventPassesIds'],
        },
      },
    );
  });
});
