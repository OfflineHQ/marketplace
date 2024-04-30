import { ShopifyCustomerStatus } from '@features/unlock/shopify';
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
  const props = {
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
  return <OffKeyGateNotConnected className="flex-1 py-2" {...props} />;
}
