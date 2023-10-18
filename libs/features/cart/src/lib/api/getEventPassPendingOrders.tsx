import env from '@env/server';
import type { Locale, Stage } from '@gql/shared/types';
import { userSdk } from '@gql/user/api';

export interface EventPassPendingOrderProps {
  locale: string;
}
export const getEventPassPendingOrders = async ({
  locale,
}: EventPassPendingOrderProps) => {
  const res = await userSdk.GetEventPassPendingOrders(
    {
      locale: locale as Locale,
      stage: env.HYGRAPH_STAGE as Stage,
    },
    { cache: 'no-store' } // TODO: remove this when we have a proper cache invalidation strategy
  );
  return res.eventPassPendingOrder;
};
