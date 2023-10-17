import { adminSdk } from '@gql/admin/api';
import { GetAlchemyInfosFromEventIdQueryVariables } from '@gql/admin/types';
import { cache } from 'react';

export const getAlchemyInfosFromEventId = cache(
  async (props: GetAlchemyInfosFromEventIdQueryVariables) => {
    const data = await adminSdk.GetAlchemyInfosFromEventId({
      eventId: props.eventId,
    });
    return data?.eventParameters?.[0];
  }
);
