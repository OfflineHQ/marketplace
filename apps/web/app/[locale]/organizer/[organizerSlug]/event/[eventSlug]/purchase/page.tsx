// This Sheet page is rendered when directly accessing the URL to purchase, the event is not displayed
import { NextIntlClientProvider, useLocale } from 'next-intl';
import { deepPick } from '@utils';
import { messages, defaultLocale, type Locale } from '@next/i18n';
import { getEventPasses } from '@features/organizer/event-api';
import type { EventPass } from '@features/organizer/event-types';
import { PassPurchaseCard } from '@features/organizer/event';
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
  passes,
  eventSlug,
  organizerSlug,
}: PurchaseSectionContentProps) {
  const t = useTranslations('Organizer.Event.PassPurchase');
  const backRoute = `/organizer/${organizerSlug}/event/${eventSlug}`;
  // TODO get reserved passes and owned passes from user if connected and change pass props so it respect boundaries. Also need to change pass purchase to handle this.

  const _locale = useLocale();
  const locale: Locale = (_locale as Locale) || defaultLocale;
  const localeMessages = deepPick(messages[locale], [
    'Organizer.Event.PassPurchase',
  ]);

  return (
    <NextIntlClientProvider locale={locale} messages={localeMessages}>
      <PassPurchaseCard
        passes={passes}
        organizerSlug={organizerSlug}
        eventSlug={eventSlug}
        title={t('title')}
        description={t('description')}
        goPaymentText={t('Footer.purchase-button')}
        goPaymentLink={{ href: '/cart' }}
        backButtonText={t('see-event-button')}
        backButtonLink={{ href: backRoute }}
      />
    </NextIntlClientProvider>
  );
}
