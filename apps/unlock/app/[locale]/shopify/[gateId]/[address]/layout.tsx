// import { ShopifyCard, ShopifyCardHeader } from '@features/unlock/shopify';
import { OffKeyLayout } from '@features/unlock/shopify';
import { type Locale } from '@next/i18n';

interface ShopifyGateAddressProps {
  params: {
    locale: Locale;
    gateId: string;
    address: string;
  };
  header: React.ReactNode;
  children: React.ReactNode;
}

export default function Layout({
  children,
  params: { locale },
  header,
}: ShopifyGateAddressProps) {
  return <OffKeyLayout header={header}>{children}</OffKeyLayout>;
}
