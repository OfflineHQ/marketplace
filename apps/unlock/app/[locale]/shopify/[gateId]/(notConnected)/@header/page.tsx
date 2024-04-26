import { getShopifyCampaignParametersForNotConnected } from '@features/unlock/shopify-api';
import { Locale } from '@gql/shared/types';
import dynamic from 'next/dynamic';
import { notFound } from 'next/navigation';

interface HeaderProps {
  params: {
    locale: Locale;
    gateId: string;
  };
}

const OffKeyHeaderNotConnected = dynamic(
  () =>
    import('@features/unlock/shopify').then(
      (mod) => mod.OffKeyHeaderNotConnected,
    ),
  { ssr: false },
);

export default async function Header({
  params: { locale, gateId },
}: HeaderProps) {
  const campaign = await getShopifyCampaignParametersForNotConnected({
    gateId,
    locale,
  });
  if (!campaign) {
    notFound();
  }
  const headerNotConnectedTexts =
    campaign.shopifyCampaignTemplate.headerNotConnectedTexts;

  const props = {
    organizerId: campaign.organizerId,
    textHeaderNotConnected: {
      customerNotConnected: headerNotConnectedTexts.titleCustomerNotConnected,
      customerConnected: headerNotConnectedTexts.titleCustomerConnected,
    },
    locale,
  };
  return <OffKeyHeaderNotConnected {...props} />;
}
