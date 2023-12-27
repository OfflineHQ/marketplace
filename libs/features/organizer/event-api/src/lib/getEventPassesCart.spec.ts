import { userSdk } from '@gql/user/api';
import { getCurrentUser } from '@next/next-auth/user';
import { getEventPassesCart } from './getEventPassesCart';

jest.mock('@next/next-auth/user');

jest.mock('@gql/user/api', () => ({
  userSdk: {
    GetPendingOrderForEventPasses: jest.fn().mockResolvedValue({
      pendingOrder: [{ id: 'test-order' }],
    }),
  },
}));

jest.mock('@features/pass-cache', () => {
  return {
    PassCache: jest.fn().mockImplementation(() => {
      return {
        getPassesCart: jest.fn().mockResolvedValue([{ id: 'test-pass-cart' }]),
      };
    }),
  };
});

describe('getEventPassesCart', () => {
  const mockEventPassesCartProps = {
    organizerSlug: 'test-organizer',
    eventSlug: 'test-event',
    eventPassIds: ['test-pass1', 'test-pass2'],
  };

  it('should return passes cart if user is not authenticated', async () => {
    (getCurrentUser as jest.Mock).mockResolvedValue(null);

    const result = await getEventPassesCart(mockEventPassesCartProps);

    expect(result).toEqual([{ id: 'test-pass-cart' }]);
  });

  it('should return event pass pending order if user is authenticated', async () => {
    const mockUser = { id: 'test-user' };
    (getCurrentUser as jest.Mock).mockResolvedValue(mockUser);

    const result = await getEventPassesCart(mockEventPassesCartProps);

    expect(result).toEqual([{ id: 'test-order' }]);
    expect(userSdk.GetPendingOrderForEventPasses).toHaveBeenCalledWith(
      { eventPassIds: mockEventPassesCartProps.eventPassIds },
      {
        next: {
          tags: ['getEventPassesCart'],
        },
      },
    );
  });
});
