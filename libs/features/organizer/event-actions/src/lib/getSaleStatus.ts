import {
  EventParametersPasses,
  SaleStatus,
} from '@features/organizer/event-types';
import { UTCDateMini } from '@time';
import { isBefore } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';

export type GetSaleStatusProps = Pick<
  EventParametersPasses,
  'dateSaleStart' | 'timezone' | 'isSaleOngoing'
>;
export function getSaleStatus({
  dateSaleStart,
  timezone,
  isSaleOngoing,
}: GetSaleStatusProps) {
  if (isSaleOngoing) {
    return SaleStatus.Ongoing;
  }
  const dateSaleStartObj = toZonedTime(dateSaleStart, timezone);
  const nowInUTC = new UTCDateMini();
  if (isBefore(nowInUTC, dateSaleStartObj)) {
    return SaleStatus.NotStarted;
  }
  return SaleStatus.Ended;
}
