// This Sheet page is rendered when directly accessing the URL to purchase, the event is not displayed

import { getEventPasses } from '@features/organizer/event/server';
import type { EventPass } from '@features/organizer/event/types';
import {
  PassPurchase,
  type PassPurchaseProps,
} from '@features/organizer/event';
import { useTranslations } from 'next-intl';

export interface PurchaseSectionProps {
  params: {
    eventSlug: string;
    organizerSlug: string;
    locale: string;
  };
}

export default async function PurchaseSection({
  params,
}: PurchaseSectionProps) {
  const { eventSlug, organizerSlug, locale } = params;
  const passes = await getEventPasses({ eventSlug, organizerSlug });

  return (
    <PurchaseSectionContent
      passes={passes}
      eventSlug={eventSlug}
      organizerSlug={organizerSlug}
    />
  );
}

interface PurchaseSectionContentProps {
  passes: EventPass[];
  eventSlug: string;
  organizerSlug: string;
}

function PurchaseSectionContent({
  passes: _passes,
  eventSlug,
  organizerSlug,
}: PurchaseSectionContentProps) {
  const t = useTranslations('Organizer.Event');
  const backRoute = `/organizer/${organizerSlug}/event/${eventSlug}`;
  // TODO get reserved passes and owned passes from user if connected and change pass props so it respect boundaries. Also need to change pass purchase to handle this.
  const passes: PassPurchaseProps['passes'] = _passes.map(
    (pass) =>
      ({
        ...pass,
        numTickets: 0,
      } satisfies PassPurchaseProps['passes'][0])
  );

  return (
    <PassPurchase
      passes={passes}
      eventSlug={eventSlug}
      size={'full'}
      title={t('pass-purchase.title')}
      description={t('pass-purchase.description')}
      goPaymentText={t('pass-purchase.purchase-button')}
      goPaymentLink={{ href: '/cart' }}
      soldOutText={t('pass-purchase.pass.sold-out')}
      backButtonText={t('pass-purchase.see-event-button')}
      backButtonLink={{ href: backRoute }}
    />
  );
}
