import { Locale } from '@gql/shared/types';
interface ShopifyGateAddressProps {
  params: {
    locale: Locale;
    gateId: string;
    address: string;
  };
}

export default function ShopifyGateAddress({
  params: { locale, gateId, address },
}: ShopifyGateAddressProps) {
  return (
    <span>
      {locale}
      {gateId}
    </span>
  );
}
