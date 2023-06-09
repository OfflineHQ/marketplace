import { NextIntlClientProvider, useLocale } from 'next-intl';
import { LocalPassListClient } from './LocalPassListClient';
import { EventPassListProps } from '../EventPassList/EventPassList';
import { deepPick } from '@utils';
import { messages, defaultLocale, type Locale } from '@client/i18n';

export type LocalPassListProps = Pick<EventPassListProps, 'EventPassesFetcher'>;

export const LocalPassList: React.FC<LocalPassListProps> = ({
  EventPassesFetcher,
}) => {
  const _locale = useLocale();
  const locale: Locale = (_locale as Locale) || defaultLocale;
  const localeMessages = deepPick(messages[locale], ['Cart.List']);
  return (
    <NextIntlClientProvider locale={locale} messages={localeMessages}>
      <LocalPassListClient EventPassesFetcher={EventPassesFetcher} />
    </NextIntlClientProvider>
  );
};
