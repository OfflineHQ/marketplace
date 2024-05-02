import { adminSdk } from '@gql/admin/api';
import { cache } from 'react';

interface GetEventProps {
  eventId: string;
}

export const getEventParameters = cache(async ({ eventId }: GetEventProps) => {
  const data = await adminSdk.GetEventParameters({
    eventId,
  });

  return data?.eventParameters;
});
