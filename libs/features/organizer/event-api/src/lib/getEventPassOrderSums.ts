import { adminSdk } from '@gql/admin/api';
import { GetEventPassOrderSumsQuery } from '@gql/admin/types';
import { cache } from 'react';

export const getEventPassOrderSums = cache(
  async ({ eventPassId }: { eventPassId: string }) => {
    const data = await adminSdk.GetEventPassOrderSums(
      { eventPassId },
      {
        next: {
          tags: [`getEventPassOrderSum-${eventPassId}`],
        },
      },
    );
    return (
      data?.eventPassOrderSums_by_pk ||
      ({
        totalReserved: 0,
      } satisfies GetEventPassOrderSumsQuery['eventPassOrderSums_by_pk'])
    );
  },
);
