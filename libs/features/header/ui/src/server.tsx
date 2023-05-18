import { pick } from 'remeda';
import { useLocale, NextIntlClientProvider } from 'next-intl';
import HeaderClient from './lib/HeaderClient';
import { messages, defaultLocale, type Locale } from '@client/i18n';

export default (async function Header() {
  const locale = useLocale();
  return (
    <NextIntlClientProvider
      locale={locale}
      messages={
        // Only provide the minimum of messages
        pick(messages[(locale as Locale) || defaultLocale], ['Header'])
      }
    >
      <HeaderClient />
    </NextIntlClientProvider>
  );
} as unknown as () => JSX.Element);
