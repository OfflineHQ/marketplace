import { ShopifyCard, ShopifyCardHeader } from '@features/unlock/shopify';
import { messages, type Locale } from '@next/i18n';
import { deepPick } from '@utils';
import { NextIntlClientProvider, useLocale } from 'next-intl';

interface LayoutProps {
  auth: React.ReactNode;
  children: React.ReactNode;
}

export default function Layout({ children, auth }: LayoutProps) {
  const locale = useLocale();
  const localeMessages = deepPick(messages[locale as Locale], ['Shopify.Auth']);
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
