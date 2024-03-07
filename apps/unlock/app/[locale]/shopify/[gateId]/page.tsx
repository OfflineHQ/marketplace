import { Locale } from '@gql/shared/types';
interface ShopifyGateProps {
  params: {
    locale: Locale;
    gateId: string;
  };
}

export default function ShopifyGate({
  params: { locale, gateId },
}: ShopifyGateProps) {
  return (
    <span>
      {locale}
      {gateId}
    </span>
  );
}
