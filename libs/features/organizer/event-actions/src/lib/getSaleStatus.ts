'use server';

import {
  EventParametersPasses,
  SaleStatus,
} from '@features/organizer/event-types';

export interface GetSaleStatusProps
  extends Pick<
    EventParametersPasses,
    'dateSaleStart' | 'dateSaleEnd' | 'timezone' | 'isSaleOngoing'
  > {}
export function getSaleStatus({
  dateSaleStart,
  dateSaleEnd,
  timezone,
  isSaleOngoing,
}: GetSaleStatusProps) {
  if (isSaleOngoing) {
    return SaleStatus.Ongoing;
  } else {
    return SaleStatus.NotStarted;
  }
}
