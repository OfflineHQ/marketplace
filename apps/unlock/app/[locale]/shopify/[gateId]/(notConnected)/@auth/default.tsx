import { OffKeyAuthSkelton } from '@features/unlock/shopify';
import { getShopifyCampaignParametersForNotConnected } from '@features/unlock/shopify-api';
import { Locale } from '@gql/shared/types';
import dynamic from 'next/dynamic';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';

interface AuthProps {
  params: {
    locale: Locale;
    gateId: string;
  };
}

const OffKeyAuth = dynamic(
  () => import('@features/unlock/shopify').then((mod) => mod.OffKeyAuth),
  { ssr: false },
);

export default function AuthSection(props: AuthProps) {
  return (
    <Suspense fallback={<OffKeyAuthSkelton />}>
      <Auth {...props} />
    </Suspense>
  );
}

async function Auth({ params: { locale, gateId } }: AuthProps) {
  const campaign = await getShopifyCampaignParametersForNotConnected({
    gateId,
    locale,
  });
  if (!campaign) {
    notFound();
  }
  const authTexts = campaign.shopifyCampaignTemplate.authTexts;
  const props = {
    organizerId: campaign.organizerId,
    textAuth: {
      createNewAccount: authTexts.createNewAccount,
      useExistingAccount: authTexts.useExistingAccount,
      useAnotherAccount: authTexts.useAnotherAccount,
      noMatchingAccount: {
        useExistingAccount: authTexts.noMatchingAccountUseExistingAccount,
        recoverMyAccount: authTexts.noMatchingAccountRecoverMyAccount,
      },
      signIn: authTexts.signIn,
    },
    locale,
  };
  return <OffKeyAuth {...props} />;
}
