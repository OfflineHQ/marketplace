// import { ShopifyAuth } from '@features/unlock/shopify';

import { OffKeyAuth } from '@features/unlock/shopify';
import { messages, type Locale } from '@next/i18n';
import { deepPick } from '@utils';
import { NextIntlClientProvider } from 'next-intl';

interface AuthProps {
  params: {
    locale: Locale;
    gateId: string;
  };
}

export default function Auth({ params: { locale } }: AuthProps) {
  const localeMessages = deepPick(messages[locale], ['Shopify.OffKeyAuth']);
  return (
    <NextIntlClientProvider locale={locale} messages={localeMessages}>
      <OffKeyAuth />
    </NextIntlClientProvider>
  );
}
