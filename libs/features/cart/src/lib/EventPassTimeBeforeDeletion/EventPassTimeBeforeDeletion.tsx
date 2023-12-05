import { defaultLocale, messages, type Locale } from '@next/i18n';
import { deepPick } from '@utils';
import { NextIntlClientProvider, useLocale } from 'next-intl';
import {
  EventPassTimeBeforeDeletionClient,
  EventPassTimeBeforeDeletionClientProps,
} from './EventPassTimeBeforeDeletionClient';

export const EventPassTimeBeforeDeletion: React.FC<
  EventPassTimeBeforeDeletionClientProps
> = (props) => {
  const _locale = useLocale();
  const locale: Locale = (_locale as Locale) || defaultLocale;
  const localeMessages = deepPick(messages[locale], [
    'Cart.List.Event.TimeBeforeDeletion',
  ]);
  return (
    <NextIntlClientProvider locale={locale} messages={localeMessages}>
      <EventPassTimeBeforeDeletionClient {...props} />
    </NextIntlClientProvider>
  );
};
