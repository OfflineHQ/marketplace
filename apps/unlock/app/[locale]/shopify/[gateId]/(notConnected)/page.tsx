import { OffKeyLayout, ShopifyCustomerStatus } from '@features/unlock/shopify';
import { getShopifyCampaignParametersForNotConnected } from '@features/unlock/shopify-api';
import { Locale } from '@gql/shared/types';
import dynamic from 'next/dynamic';
import { notFound } from 'next/navigation';

const OffKeyGateNotConnected = dynamic(
  () =>
    import('@features/unlock/shopify').then(
      (mod) => mod.OffKeyGateNotConnected,
    ),
  { ssr: false },
);

const OffKeyAuth = dynamic(
  () => import('@features/unlock/shopify').then((mod) => mod.OffKeyAuth),
  { ssr: false },
);

const OffKeyHeaderNotConnected = dynamic(
  () =>
    import('@features/unlock/shopify').then(
      (mod) => mod.OffKeyHeaderNotConnected,
    ),
  { ssr: false },
);

interface GateNotConnectedProps {
  params: {
    locale: Locale;
    gateId: string;
  };
}

export default async function GateNotConnected({
  params: { locale, gateId },
}: GateNotConnectedProps) {
  const campaign = await getShopifyCampaignParametersForNotConnected({
    gateId,
    locale,
  });
  if (!campaign) {
    notFound();
  }
  const gateNotConnectedTexts =
    campaign.shopifyCampaignTemplate.gateNotConnectedTexts;
  const propsGateNotConnected = {
    organizerId: campaign.organizerId,
    textGateNotConnected: {
      subtitle: {
        [ShopifyCustomerStatus.NotConnected]:
          gateNotConnectedTexts.subtitleCustomerNotConnected,
        [ShopifyCustomerStatus.ExistingAccountNewCustomer]:
          gateNotConnectedTexts.subtitleExistingAccountNewCustomer,
        [ShopifyCustomerStatus.NewAccount]:
          gateNotConnectedTexts.subtitleNewAccount,
        [ShopifyCustomerStatus.MatchingAccount]:
          gateNotConnectedTexts.subtitleMatchingAccount,
        [ShopifyCustomerStatus.NoMatchingAccount]:
          gateNotConnectedTexts.subtitleNoMatchingAccount,
      },
      mainText: {
        [ShopifyCustomerStatus.NotConnected]:
          gateNotConnectedTexts.paragraphCustomerNotConnected,
        [ShopifyCustomerStatus.ExistingAccountNewCustomer]:
          gateNotConnectedTexts.paragraphExistingAccountNewCustomer,
        [ShopifyCustomerStatus.NewAccount]:
          gateNotConnectedTexts.paragraphNewAccount,
        [ShopifyCustomerStatus.MatchingAccount]:
          gateNotConnectedTexts.paragraphMatchingAccount,
        [ShopifyCustomerStatus.NoMatchingAccount]:
          gateNotConnectedTexts.paragraphNoMatchingAccount,
      },
    },
    locale,
  };
  const authTexts = campaign.shopifyCampaignTemplate.authTexts;
  const propsAuth = {
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

  const headerNotConnectedTexts =
    campaign.shopifyCampaignTemplate.headerNotConnectedTexts;

  const propsHeaderNotConnected = {
    organizerId: campaign.organizerId,
    textHeaderNotConnected: {
      customerNotConnected: headerNotConnectedTexts.titleCustomerNotConnected,
      customerConnected: headerNotConnectedTexts.titleCustomerConnected,
    },
    locale,
  };
  return (
    <OffKeyLayout
      header={<OffKeyHeaderNotConnected {...propsHeaderNotConnected} />}
    >
      <OffKeyGateNotConnected
        className="flex-1 py-2"
        {...propsGateNotConnected}
      />
      <OffKeyAuth {...propsAuth} />
    </OffKeyLayout>
  );
}
