// This Sheet page is rendered when directly accessing the URL to purchase, the event is not displayed

import { getEventPasses } from '@features/organizer/event/server';
import type { EventPass } from '@features/organizer/event/types';
import {
  PurchaseSectionClient,
  type PurchaseSectionClientProps,
} from './PurchaseSectionClient';
import { useTranslations } from 'next-intl';

interface PurchaseSectionProps {
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
  // TODO get reserved passes and owned passes from user if connected and change pass props so it respect boundaries. Also need to change pass purchase to handle this.
  const passes: PurchaseSectionClientProps['passes'] = _passes.map(
    (pass) =>
      ({
        ...pass,
        numTickets: 0,
      } satisfies PurchaseSectionClientProps['passes'][0])
  );

  return (
    // <div className="flex min-h-[1024px] w-full min-w-[1080px] bg-red-600">
    //   purchase page
    // </div>
    <PurchaseSectionClient
      passes={passes}
      title={t('pass-purchase.title')}
      description={t('pass-purchase.description')}
      goPaymentText={t('pass-purchase.purchase-button')}
      soldOutText={t('pass-purchase.pass.sold-out')}
    />
  );
}
