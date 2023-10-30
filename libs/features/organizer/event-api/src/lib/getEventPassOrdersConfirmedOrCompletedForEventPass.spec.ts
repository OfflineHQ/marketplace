import { userSdk } from '@gql/user/api';
import { getCurrentUser } from '@next/next-auth/user';
import { getEventPassOrdersConfirmedOrCompletedForEventPass } from './getEventPassOrdersConfirmedOrCompletedForEventPass';

jest.mock('@next/next-auth/user');

jest.mock('@gql/user/api', () => ({
  userSdk: {
    GetEventPassOrdersConfirmedOrCompletedForEventPassId: jest
      .fn()
      .mockResolvedValue({
        eventPassOrder: [{ id: 'test-order' }],
      }),
  },
}));

describe('getEventPassOrdersConfirmedOrCompletedForEventPass', () => {
  const mockEventPassId = 'test-pass';

  it('should return null if user is not authenticated', async () => {
    (getCurrentUser as jest.Mock).mockResolvedValue(null);

    const result = await getEventPassOrdersConfirmedOrCompletedForEventPass({
      eventPassId: mockEventPassId,
    });

    expect(result).toBeNull();
  });

  it('should return event pass orders confirmed or completed if user is authenticated', async () => {
    const mockUser = { id: 'test-user' };
    (getCurrentUser as jest.Mock).mockResolvedValue(mockUser);

    const result = await getEventPassOrdersConfirmedOrCompletedForEventPass({
      eventPassId: mockEventPassId,
    });

    expect(result).toEqual([{ id: 'test-order' }]);
    expect(
      userSdk.GetEventPassOrdersConfirmedOrCompletedForEventPassId,
    ).toHaveBeenCalledWith(
      { eventPassId: mockEventPassId },
      {
        next: {
          tags: [
            `GetEventPassOrdersConfirmedOrCompletedForEventPassId-${mockEventPassId}`,
          ],
        },
      },
    );
  });
});
