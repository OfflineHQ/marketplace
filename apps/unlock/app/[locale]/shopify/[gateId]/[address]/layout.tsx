import { ShopifyCard, ShopifyCardHeader } from '@features/unlock/shopify';
import { messages, type Locale } from '@next/i18n';
import { deepPick } from '@utils';
import { NextIntlClientProvider } from 'next-intl';

interface ShopifyGateAddressProps {
  params: {
    locale: Locale;
    gateId: string;
    address: string;
  };
  profile: React.ReactNode;
  children: React.ReactNode;
}

export default function Layout({
  children,
  params: { locale },
  profile,
}: ShopifyGateAddressProps) {
  const localeMessages = deepPick(messages[locale], ['Shopify.Profile']);
  return (
    <ShopifyCard
      header={
        <NextIntlClientProvider locale={locale} messages={localeMessages}>
          <ShopifyCardHeader profile={profile} />
        </NextIntlClientProvider>
      }
    >
      {children}
    </ShopifyCard>
  );
}
