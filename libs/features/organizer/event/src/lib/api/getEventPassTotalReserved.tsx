import { adminSdk } from '@gql/admin/api';
import { cache } from 'react';

interface GetEventPassTotalReservedProps {
  eventPassId: string;
}

export const getEventPassTotalReserved = cache(
  async ({ eventPassId }: GetEventPassTotalReservedProps) => {
    const data = await adminSdk.GetEventPassTotalReserved({
      eventPassId,
    });
    return data?.eventPassOrder_aggregate?.aggregate?.sum?.quantity || 0;
  }
);
