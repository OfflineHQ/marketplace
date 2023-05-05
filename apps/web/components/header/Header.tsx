import * as R from 'remeda';
import { useLocale, NextIntlClientProvider } from 'next-intl';
import HeaderClient from './HeaderClient';

export default (async function Header() {
  const locale = useLocale();
  const messages = (await import(`../../messages/${locale}.json`)).default;

  return (
    <NextIntlClientProvider
      locale={locale}
      messages={
        // Only provide the minimum of messages
        R.pick(messages, ['Header'])
      }
    >
      <HeaderClient />
    </NextIntlClientProvider>
  );
} as unknown as () => JSX.Element);
