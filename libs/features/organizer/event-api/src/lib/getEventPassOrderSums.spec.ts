import { adminSdk } from '@gql/admin/api';
import { getEventPassOrderSums } from './getEventPassOrderSums';

jest.mock('@gql/admin/api', () => ({
  adminSdk: {
    GetEventPassOrderSums: jest.fn().mockResolvedValue({
      eventPassOrderSums_by_pk: { totalReserved: 10 },
    }),
  },
}));

describe('getEventPassOrderSums', () => {
  const mockEventPassId = 'test-pass';

  it('should return event pass order sums', async () => {
    const result = await getEventPassOrderSums({
      eventPassId: mockEventPassId,
    });

    expect(result).toEqual({ totalReserved: 10 });
    expect(adminSdk.GetEventPassOrderSums).toHaveBeenCalledWith(
      { eventPassId: mockEventPassId },
      {
        next: {
          tags: [`getEventPassOrderSum-${mockEventPassId}`],
        },
      },
    );
  });

  it('should return default value if data is null', async () => {
    (adminSdk.GetEventPassOrderSums as jest.Mock).mockResolvedValue(null);

    const result = await getEventPassOrderSums({
      eventPassId: mockEventPassId,
    });

    expect(result).toEqual({ totalReserved: 0 });
  });
});
