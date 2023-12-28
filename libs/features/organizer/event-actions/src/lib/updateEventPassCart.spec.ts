import { PassCache } from '@features/pass-cache';
import { userSdk } from '@gql/user/api';
import { getCurrentUser } from '@next/next-auth/user';
import { updateEventPassCart } from './updateEventPassCart';

jest.mock('@gql/user/api');
jest.mock('@features/pass-cache');
jest.mock('@next/next-auth/user');

describe('updateEventPassCart', () => {
  const mockProps = {
    organizerSlug: 'test-organizer',
    eventSlug: 'test-event',
    eventPassId: 'test-pass',
    quantity: 10,
  };

  it('should delete pass cart if user is not logged in and quantity is 0', async () => {
    (getCurrentUser as jest.Mock).mockResolvedValue(null);
    await updateEventPassCart({ ...mockProps, quantity: 0 });
    expect(PassCache.prototype.deletePassCart).toHaveBeenCalledWith({
      organizerSlug: mockProps.organizerSlug,
      eventSlug: mockProps.eventSlug,
      eventPassId: mockProps.eventPassId,
    });
  });

  it('should update pass cart if user is not logged in and quantity is not 0', async () => {
    (getCurrentUser as jest.Mock).mockResolvedValue(null);
    await updateEventPassCart(mockProps);
    expect(PassCache.prototype.updatePassCart).toHaveBeenCalledWith({
      organizerSlug: mockProps.organizerSlug,
      eventSlug: mockProps.eventSlug,
      pass: {
        eventPassId: mockProps.eventPassId,
        quantity: mockProps.quantity,
      },
    });
  });

  it('should delete event pass pending orders if user is logged in and quantity is 0', async () => {
    (getCurrentUser as jest.Mock).mockResolvedValue({});
    await updateEventPassCart({ ...mockProps, quantity: 0 });
    expect(userSdk.DeletePendingOrders).toHaveBeenCalledWith({
      eventPassIds: [mockProps.eventPassId],
    });
  });

  it('should upsert event pass pending order if user is logged in and quantity is not 0', async () => {
    (getCurrentUser as jest.Mock).mockResolvedValue({});
    await updateEventPassCart(mockProps);
    expect(userSdk.UpsertEventPassPendingOrder).toHaveBeenCalledWith({
      object: {
        eventPassId: mockProps.eventPassId,
        quantity: mockProps.quantity,
      },
    });
  });
});
