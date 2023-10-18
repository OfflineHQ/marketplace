import {
  PassPurchaseSheet,
  PassPurchaseSheetContainer,
} from '@features/organizer/event';
import {
  getEventPassOrdersConfirmedOrCompletedForEventPassIds,
  getEventPasses,
  getEventPassesCart,
} from '@features/organizer/event-api';
import type { EventPass, EventPassCart } from '@features/organizer/event-types';
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
  const eventPassesCart = await getEventPassesCart({
    eventSlug,
    organizerSlug,
    eventPassIds: passes.map((pass) => pass.id),
  });
  const existingEventPasses =
    await getEventPassOrdersConfirmedOrCompletedForEventPassIds({
      eventPassIds: passes.map((pass) => pass.id),
    });
  return (
    <PurchaseSectionContent
      passes={passes}
      eventPassesCart={eventPassesCart}
      existingEventPasses={existingEventPasses}
      eventSlug={eventSlug}
      organizerSlug={organizerSlug}
    />
  );
}

interface PurchaseSectionContentProps {
  passes: EventPass[];
  eventPassesCart: EventPassCart[] | null;
  existingEventPasses: EventPassCart[] | null;
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
