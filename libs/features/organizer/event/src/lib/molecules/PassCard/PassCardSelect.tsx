import { ButtonSkeleton } from '@ui/components';

import {
  getEventPassCart,
  getEventPassOrderSums,
  getOrderPurchasedForEventPass,
} from '@features/organizer/event-api';
import type { EventPass, EventSlugs } from '@features/organizer/event-types';
import { deepPick } from '@utils';
import { NextIntlClientProvider, useLocale } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { Suspense } from 'react';
import { PassCardStatusBadge } from '../../atoms/PassCardStatusBadge/PassCardStatusBadge';
import { PassCardSelectClient } from './PassCardSelectClient';

export interface PassCardSelectProps
  extends Omit<
      EventPass,
      'description' | 'name' | 'passOptions' | 'nftImage' | 'passPricing'
    >,
    EventSlugs {
  hasConfirmedPasses?: boolean;
}

export const PassCardSelect: React.FC<PassCardSelectProps> = (props) => {
  return (
    <Suspense fallback={<PassCardSelectSkeleton />}>
      <PassCardSelectContent {...props} />
    </Suspense>
  );
};

export const PassCardSelectContent: React.FC<PassCardSelectProps> = async ({
  passAmount,
  organizerSlug,
  eventSlug,
  id,
  hasConfirmedPasses,
  ...props
}) => {
  const eventPassOrderSums = await getEventPassOrderSums({ eventPassId: id });
  const eventPassCart = await getEventPassCart({
    organizerSlug,
    eventSlug,
    eventPassId: id,
  });
  const existingEventPasses = await getOrderPurchasedForEventPass({
    eventPassId: id,
  });
  const locale = useLocale();
  const messages = await getMessages(locale as any);
  const localeMessages = deepPick(messages, ['Organizer.Event.PassPurchase']);

  // here compute the max amount of tickets that can be bought
  const totalReserved = eventPassOrderSums?.totalReserved ?? 0;
  const maxAvailableTickets = (passAmount?.maxAmount || 0) - totalReserved;
  // if don't have a limit by customer simply return the max available
  let maxVal = maxAvailableTickets;
  if (
    passAmount?.maxAmountPerUser &&
    passAmount.maxAmountPerUser <= maxAvailableTickets
  ) {
    // check if customer already have some passes bought or in purchase process and deduce it from the max amount per user
    if (existingEventPasses?.length) {
      const existingEventPassesSum = existingEventPasses.reduce(
        (sum, pass) => sum + pass.quantity,
        0,
      );
      maxVal =
        passAmount.maxAmountPerUser - existingEventPassesSum > 0
          ? passAmount.maxAmountPerUser - existingEventPassesSum
          : 0;
    }
    // if no existing passes simply return the max amount per user
    else maxVal = passAmount.maxAmountPerUser;
  }
  return (
    <div className="flex gap-1">
      {maxVal <= 0 || hasConfirmedPasses ? (
        <PassCardStatusBadge
          isSoldOut={maxVal <= 0}
          hasConfirmedPasses={hasConfirmedPasses}
        />
      ) : (
        <NextIntlClientProvider locale={locale} messages={localeMessages}>
          <PassCardSelectClient
            initialValue={eventPassCart?.quantity || 0}
            maxVal={maxVal}
            organizerSlug={organizerSlug}
            eventSlug={eventSlug}
            eventPassId={id}
          />
        </NextIntlClientProvider>
      )}
    </div>
  );
};

export const PassCardSelectSkeleton = () => (
  <div className="flex gap-1">
    <ButtonSkeleton />
  </div>
);
