import { NextIntlClientProvider, useLocale } from 'next-intl';
import {
  LocalPassListClient,
  type LocalPassListClientProps,
} from './LocalPassListClient';
import { deepPick } from '@utils';
import { messages, defaultLocale, type Locale } from '@next/i18n';

export type LocalPassListProps = Pick<
  LocalPassListClientProps,
  'EventPassesFetcher' | 'userPassPendingOrders'
>;

export const LocalPassList: React.FC<LocalPassListProps> = ({
  EventPassesFetcher,
  userPassPendingOrders,
}) => {
  const _locale = useLocale();
  const locale: Locale = (_locale as Locale) || defaultLocale;
  const localeMessages = deepPick(messages[locale], ['Cart.List']);
  return (
    <NextIntlClientProvider locale={locale} messages={localeMessages}>
      <LocalPassListClient
        EventPassesFetcher={EventPassesFetcher}
        userPassPendingOrders={userPassPendingOrders}
      />
    </NextIntlClientProvider>
  );
};
