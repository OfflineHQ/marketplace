import { Badge, BoundedNumericStepper, ButtonSkeleton } from '@ui/components';

import {
  getEventPassCart,
  getEventPassOrderSums,
  getEventPassOrdersConfirmedOrCompletedForEventPassId,
} from '@features/organizer/event-api';
import type { EventPass, EventSlugs } from '@features/organizer/event-types';
import { useLocale } from 'next-intl';
import { getTranslator } from 'next-intl/server';
import { Suspense } from 'react';

export interface PassCardSelectProps
  extends Omit<EventPass, 'description' | 'name' | 'passOptions' | 'nftImage'>,
    EventSlugs {}

export const PassCardSelect: React.FC<PassCardSelectProps> = (props) => {
  return (
    <Suspense fallback={<PassCardSelectSkeleton />}>
      <PassCardSelectContent {...props} />
    </Suspense>
  );
};

// export interface PassCardSelectContentProps extends PassCardSelectProps {
//   eventPassOrderSums: EventPassOrderSums;
//   eventPassCart: EventPassCart | null;
//   existingEventPass: EventPassCart | null;
// }

export const PassCardSelectContent: React.FC<PassCardSelectProps> = async ({
  eventPassPricing,
  organizerSlug,
  eventSlug,
  id,
  ...props
}) => {
  const locale = useLocale();
  const t = await getTranslator(locale, 'Organizer.Event.PassPurchase.Pass');
  const eventPassOrderSums = await getEventPassOrderSums({ eventPassId: id });
  const eventPassCart = await getEventPassCart({
    organizerSlug,
    eventSlug,
    eventPassId: id,
  });
  const existingEventPasses =
    await getEventPassOrdersConfirmedOrCompletedForEventPassId({
      eventPassId: id,
    });
  // const handleOnChange = (newNumTickets: number) => {
  //   store.updatePassCart({
  //     organizerSlug,
  //     eventSlug,
  //     pass: {
  //       eventPassId: id,
  //       quantity: newNumTickets,
  //     },
  //   });
  // };

  // here compute the max amount of tickets that can be bought
  const totalReserved = eventPassOrderSums?.totalReserved ?? 0;
  const maxAvailableTickets =
    (eventPassPricing?.maxAmount || 0) - totalReserved;
  // if don't have a limit by customer simply return the max available
  let maxVal = maxAvailableTickets;
  if (
    eventPassPricing?.maxAmountPerUser &&
    eventPassPricing.maxAmountPerUser <= maxAvailableTickets
  ) {
    // check if customer already have some passes bought or in purchase process and deduce it from the max amount per user
    if (existingEventPasses?.length) {
      const existingEventPassesSum = existingEventPasses.reduce(
        (sum, pass) => sum + pass.quantity,
        0,
      );
      maxVal =
        eventPassPricing.maxAmountPerUser - existingEventPassesSum > 0
          ? eventPassPricing.maxAmountPerUser - existingEventPassesSum
          : 0;
    }
    // if no existing passes simply return the max amount per user
    else maxVal = eventPassPricing.maxAmountPerUser;
  }
  return (
    <div className="flex gap-1">
      {maxVal <= 0 ? (
        <Badge variant="secondary">{t('sold-out')}</Badge>
      ) : (
        <BoundedNumericStepper
          // onChange={handleOnChange}
          initialValue={eventPassCart?.quantity || 0}
          maxVal={maxVal}
        />
      )}
    </div>
  );
};

export const PassCardSelectSkeleton = () => (
  <div className="flex gap-1">
    <ButtonSkeleton />
  </div>
);
