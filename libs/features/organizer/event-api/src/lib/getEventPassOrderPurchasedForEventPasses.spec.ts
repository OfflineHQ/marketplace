import { userSdk } from '@gql/user/api';
import { getCurrentUser } from '@next/next-auth/user';
import { getEventPassOrderPurchasedForEventPasses } from './getEventPassOrderPurchasedForEventPasses';

jest.mock('@next/next-auth/user');

jest.mock('@gql/user/api', () => ({
  userSdk: {
    GetEventPassOrderPurchasedForEventPassesIds: jest.fn().mockResolvedValue({
      eventPassOrder: [{ id: 'test-order' }],
    }),
  },
}));

describe('getEventPassOrdersConfirmedOrCompletedForEventPasses', () => {
  const mockEventPassIds = ['test-pass1', 'test-pass2'];

  it('should return null if user is not authenticated', async () => {
    (getCurrentUser as jest.Mock).mockResolvedValue(null);

    const result = await getEventPassOrderPurchasedForEventPasses({
      eventPassIds: mockEventPassIds,
    });

    expect(result).toBeNull();
  });

  it('should return event pass orders confirmed or completed if user is authenticated', async () => {
    const mockUser = { id: 'test-user' };
    (getCurrentUser as jest.Mock).mockResolvedValue(mockUser);

    const result = await getEventPassOrderPurchasedForEventPasses({
      eventPassIds: mockEventPassIds,
    });

    expect(result).toEqual([{ id: 'test-order' }]);
    expect(
      userSdk.GetEventPassOrderPurchasedForEventPassesIds,
    ).toHaveBeenCalledWith(
      { eventPassIds: mockEventPassIds },
      {
        next: {
          tags: ['GetEventPassOrderPurchasedForEventPassesIds'],
        },
      },
    );
  });
});
