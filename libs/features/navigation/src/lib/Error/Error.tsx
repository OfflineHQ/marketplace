import { defaultLocale, messages, type Locale } from '@next/i18n';
import { deepPick } from '@utils';
import { NextIntlClientProvider, useLocale } from 'next-intl';
import { ErrorClient, type ErrorProps } from './ErrorClient';

export function Error(props: ErrorProps) {
  const _locale = useLocale();
  const locale: Locale = (_locale as Locale) || defaultLocale;
  const localeMessages = deepPick(messages[locale], ['Navigation']);
  return (
    <NextIntlClientProvider locale={locale} messages={localeMessages}>
      <ErrorClient {...props} />
    </NextIntlClientProvider>
  );
}
