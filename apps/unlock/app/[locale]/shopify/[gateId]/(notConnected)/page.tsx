import { OffKeyGateSignIn } from '@features/unlock/shopify';
import { Locale } from '@gql/shared/types';
interface GateSignInProps {
  params: {
    locale: Locale;
    gateId: string;
  };
}

export default function GateSignIn({
  params: { locale, gateId },
}: GateSignInProps) {
  return <OffKeyGateSignIn gateId={gateId} />;
}
