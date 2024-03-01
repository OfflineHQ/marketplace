import { adminSdk } from '@gql/admin/api';
import { GetAlchemyInfosFromLoyaltyCardIdQueryVariables } from '@gql/admin/types';
import { cache } from 'react';

export const GetAlchemyInfosFromLoyaltyCardId = cache(
  async (props: GetAlchemyInfosFromLoyaltyCardIdQueryVariables) => {
    const data = await adminSdk.GetAlchemyInfosFromLoyaltyCardId({
      loyaltyCardId: props.loyaltyCardId,
    });
    return data?.loyaltyCardParameters?.[0];
  },
);
