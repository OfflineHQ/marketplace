import { ShopifyProfileNav } from '@features/unlock/shopify';
import { Locale } from '@gql/shared/types';

interface ShopifyGateAddressProps {
  params: {
    locale: Locale;
    gateId: string;
    address: string;
  };
}

export default function Profile({
  params: { address },
}: ShopifyGateAddressProps) {
  return <ShopifyProfileNav user={{ address, id: '' }} />;
}
