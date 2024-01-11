'use server';

import {
  EventParametersPasses,
  SaleStatus,
} from '@features/organizer/event-types';
import { UTCDateMini } from '@time';
import { isBefore } from 'date-fns';
import { utcToZonedTime } from 'date-fns-tz';

export interface GetSaleStatusProps
  extends Pick<
    EventParametersPasses,
    'dateSaleStart' | 'timezone' | 'isSaleOngoing'
  > {}
export function getSaleStatus({
  dateSaleStart,
  timezone,
  isSaleOngoing,
}: GetSaleStatusProps) {
  if (isSaleOngoing) {
    return SaleStatus.Ongoing;
  }
  const dateSaleStartObj = utcToZonedTime(dateSaleStart, timezone);
  const nowInUTC = new UTCDateMini();
  if (isBefore(nowInUTC, dateSaleStartObj)) {
    return SaleStatus.NotStarted;
  }
  return SaleStatus.Ended;
}
