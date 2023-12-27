import { adminSdk } from '@gql/admin/api';
import { cache } from 'react';

export const getEventPassOrderSums = cache(
  async ({ eventPassId }: { eventPassId: string }) => {
    const data = await adminSdk.GetEventPassOrderSums(
      { eventPassId },
      {
        next: {
          tags: [`getOrderSum-${eventPassId}`],
        },
      },
    );
    return (
      data?.eventPassOrderSums_by_pk ||
      ({
        totalReserved: 0,
      } satisfies OrderSumsGetEventPassOrderSumsQuery['eventPassOrderSums_by_pk'])
    );
  },
);
