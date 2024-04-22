'use server';

import { adminSdk } from '@gql/admin/api';
import { GetAlchemyInfosFromLoyaltyCardIdQueryVariables } from '@gql/admin/types';

export async function getAlchemyInfosFromLoyaltyCardId(
  props: GetAlchemyInfosFromLoyaltyCardIdQueryVariables,
) {
  const data = await adminSdk.GetAlchemyInfosFromLoyaltyCardId({
    loyaltyCardId: props.loyaltyCardId,
  });
  return data?.loyaltyCardParameters?.[0];
}
