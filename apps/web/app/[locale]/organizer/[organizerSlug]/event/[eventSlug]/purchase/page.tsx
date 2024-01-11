import { AppContainer } from '@features/app-nav';
import { NotFound } from '@features/navigation';
import {
  PassPurchaseCard,
  PassPurchaseCardProps,
} from '@features/organizer/event';
import {
  getEventPasses,
  getOrdersConfirmed,
} from '@features/organizer/event-api';
import type { EventPass } from '@features/organizer/event-types';
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
  const passes = await getEventPasses({ eventSlug, locale });
  // in case the event is not found or the organizer slug is not the same as the one in the url redirect to 404
  if (!passes || passes.event?.organizer?.slug !== organizerSlug)
    return <NotFound />;
  else {
    const confirmedPasses = await getOrdersConfirmed();
    const { eventPasses, event } = passes;
    return event.eventParameters ? (
      <PurchaseSectionContent
        passes={eventPasses}
        eventParameters={event.eventParameters}
        eventSlug={eventSlug}
        organizerSlug={organizerSlug}
        hasConfirmedPasses={!!confirmedPasses?.length}
      />
    ) : (
      <NotFound />
    );
  }
}

interface PurchaseSectionContentProps
  extends Pick<PassPurchaseCardProps, 'eventParameters'> {
  passes: EventPass[];
  eventSlug: string;
  organizerSlug: string;
  hasConfirmedPasses: boolean;
}

function PurchaseSectionContent({
  passes,
  eventSlug,
  organizerSlug,
  hasConfirmedPasses,
  eventParameters,
}: PurchaseSectionContentProps) {
  const t = useTranslations('Organizer.Event.PassPurchase');
  const backRoute = `/organizer/${organizerSlug}/event/${eventSlug}`;
  return (
    <AppContainer>
      <PassPurchaseCard
        passes={passes}
        organizerSlug={organizerSlug}
        eventSlug={eventSlug}
        eventParameters={eventParameters}
        title={t('title')}
        description={t('description')}
        goPaymentText={
          hasConfirmedPasses
            ? t('Footer.finalize-payment')
            : t('Footer.purchase-button')
        }
        goPaymentLink={{
          href: hasConfirmedPasses ? '/cart/purchase' : '/cart',
        }}
        backButtonText={t('see-event-button')}
        backButtonLink={{ href: backRoute }}
      />
    </AppContainer>
  );
}
