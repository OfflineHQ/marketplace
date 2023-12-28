import { userSdk } from '@gql/user/api';
import { getCurrentUser } from '@next/next-auth/user';
import { getEventPassCart } from './getEventPassCart';

jest.mock('@next/next-auth/user');

jest.mock('@gql/user/api', () => ({
  userSdk: {
    GetPendingOrderForEventPass: jest.fn().mockResolvedValue({
      pendingOrder: [{ id: 'test-order' }],
    }),
  },
}));
jest.mock('@features/pass-cache', () => {
  return {
    PassCache: jest.fn().mockImplementation(() => {
      return {
        getPassCart: jest.fn().mockResolvedValue({ id: 'test-pass-cart' }),
      };
    }),
  };
});

describe('getEventPassCart', () => {
  const mockEventPassCartProps = {
    organizerSlug: 'test-organizer',
    eventSlug: 'test-event',
    eventPassId: 'test-pass',
  };

  it('should return pass cart if user is not authenticated', async () => {
    (getCurrentUser as jest.Mock).mockResolvedValue(null);

    const result = await getEventPassCart(mockEventPassCartProps);

    expect(result).toEqual({ id: 'test-pass-cart' });
  });

  it('should return event pass pending order if user is authenticated', async () => {
    const mockUser = { id: 'test-user' };
    (getCurrentUser as jest.Mock).mockResolvedValue(mockUser);

    const result = await getEventPassCart(mockEventPassCartProps);

    expect(result).toEqual({ id: 'test-order' });
    expect(userSdk.GetPendingOrderForEventPass).toHaveBeenCalledWith(
      { eventPassId: mockEventPassCartProps.eventPassId },
      {
        next: {
          tags: [`getEventPassCart-${mockEventPassCartProps.eventPassId}`],
        },
      },
    );
  });
});
