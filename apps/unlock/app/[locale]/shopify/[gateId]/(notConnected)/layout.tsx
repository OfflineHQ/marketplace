import { ShopifyCard, ShopifyCardHeader } from '@features/unlock/shopify';
import { messages, type Locale } from '@next/i18n';
import { deepPick } from '@utils';
import { NextIntlClientProvider } from 'next-intl';

interface LayoutProps {
  children: React.ReactNode;
  auth: React.ReactNode;
  params: {
    locale: Locale;
    gateId: string;
  };
}

export default function Layout({
  children,
  auth,
  params: { locale },
}: LayoutProps) {
  const localeMessages = deepPick(messages[locale], ['Shopify.Auth']);
  return (
    <ShopifyCard
      footer={
        <NextIntlClientProvider locale={locale} messages={localeMessages}>
          {auth}
        </NextIntlClientProvider>
      }
      header={<ShopifyCardHeader />}
    >
      {children}
    </ShopifyCard>
  );
}
