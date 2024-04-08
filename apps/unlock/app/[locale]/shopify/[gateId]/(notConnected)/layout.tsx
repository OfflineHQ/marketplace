// import { ShopifyCard, ShopifyCardHeader } from '@features/unlock/shopify';
import { OffKeyLayout } from '@features/unlock/shopify';
import { messages, type Locale } from '@next/i18n';
import { deepPick } from '@utils';

interface LayoutProps {
  children: React.ReactNode;
  auth: React.ReactNode;
  header: React.ReactNode;
  params: {
    locale: Locale;
    gateId: string;
  };
}

export default function Layout({
  children,
  auth,
  header,
  params: { locale },
}: LayoutProps) {
  const localeMessages = deepPick(messages[locale], ['Shopify.Auth']);
  return (
    <OffKeyLayout header={header}>
      {children}
      {auth}
    </OffKeyLayout>
    // <ShopifyCard
    //   footer={
    //     <NextIntlClientProvider locale={locale} messages={localeMessages}>
    //       {auth}
    //     </NextIntlClientProvider>
    //   }
    //   header={<ShopifyCardHeader />}
    // >
    //   {children}
    // </ShopifyCard>
  );
}
