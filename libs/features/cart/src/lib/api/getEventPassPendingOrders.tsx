import { userSdk } from '@gql/user/api';
import type { Locale, Stage } from '@gql/shared/types';

export interface EventPassPendingOrderProps {
  locale: string;
}
export const getEventPassPendingOrders = async ({
  locale,
}: EventPassPendingOrderProps) => {
  const res = await userSdk.GetEventPassPendingOrders(
    {
      locale: locale as Locale,
      stage: process.env.HYGRAPH_STAGE as Stage,
    },
    { cache: 'no-store' }
  );
  return res.eventPassPendingOrder;
};
