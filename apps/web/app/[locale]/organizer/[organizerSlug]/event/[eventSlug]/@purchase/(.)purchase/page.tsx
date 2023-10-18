import {
  PassPurchaseSheet,
  PassPurchaseSheetContainer,
} from '@features/organizer/event';
import { getEventPasses } from '@features/organizer/event-api';
import type { EventPass } from '@features/organizer/event-types';
import { defaultLocale, messages, type Locale } from '@next/i18n';
import { deepPick } from '@utils';
import { NextIntlClientProvider, useLocale, useTranslations } from 'next-intl';

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
  // TODO get reserved passes and owned passes from user if connected.

  const _locale = useLocale();
  const locale: Locale = (_locale as Locale) || defaultLocale;
  const localeMessages = deepPick(messages[locale], [
    'Organizer.Event.PassPurchase',
  ]);
  return (
    <PassPurchaseSheetContainer open={true}>
      <NextIntlClientProvider locale={locale} messages={localeMessages}>
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
      </NextIntlClientProvider>
    </PassPurchaseSheetContainer>
  );
}
