import { adminSdk } from '@gql/admin/api';
import { GetSigningKeyFromEventIdQueryVariables } from '@gql/admin/types';
import { cache } from 'react';

export const getSigningKeyFromEventId = cache(
  async (props: GetSigningKeyFromEventIdQueryVariables) => {
    const data = await adminSdk.GetSigningKeyFromEventId({
      eventId: props.eventId,
    });
    return data?.eventParameters?.[0];
  }
);
