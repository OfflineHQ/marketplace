import {
  PassPurchaseSheet,
  PassPurchaseSheetContainer,
  PassPurchaseSheetSkeleton,
} from '@features/organizer/event';
import { getEventPasses } from '@features/organizer/event-api';
import { getTranslator } from 'next-intl/server';
import { Suspense } from 'react';
import EventSection from '../../../page';

interface PurchaseSectionProps {
  params: {
    eventSlug: string;
    organizerSlug: string;
    locale: string;
  };
}

export default function PurchaseSection({ params }: PurchaseSectionProps) {
  return (
    <>
      <EventSection params={params} />
      <PassPurchaseSheetContainer>
        <Suspense fallback={<PassPurchaseSheetSkeleton />}>
          <PurchaseSectionContent {...params} />
        </Suspense>
      </PassPurchaseSheetContainer>
    </>
  );
}

interface PurchaseSectionContentProps {
  eventSlug: string;
  organizerSlug: string;
  locale: string;
}

const PurchaseSectionContent: React.FC<PurchaseSectionContentProps> = async ({
  eventSlug,
  organizerSlug,
  locale,
}) => {
  const t = await getTranslator(locale, 'Organizer.Event.PassPurchase');
  const passes = await getEventPasses({ eventSlug, locale });
  return (
    <PassPurchaseSheet
      passes={passes}
      organizerSlug={organizerSlug}
      eventSlug={eventSlug}
      size={'lg'}
      title={t('title')}
      description={t('description')}
      goPaymentText={t('Footer.purchase-button')}
      goPaymentLink={{ href: '/cart' }}
      backButtonText={t('go-back-button')}
    />
  );
};
