import { OffKeyViewHeaderConnected } from '@features/unlock/shopify';
import { getShopifyCampaignParametersForConnected } from '@features/unlock/shopify-api';
import { Locale } from '@gql/shared/types';
import dynamic from 'next/dynamic';
import { notFound } from 'next/navigation';

interface HeaderProps {
  params: {
    locale: Locale;
    gateId: string;
    address: string;
  };
}

const OffKeyProfile = dynamic(
  () => import('@features/unlock/shopify').then((mod) => mod.OffKeyProfile),
  { ssr: false },
);
const OffKeyHeaderConnected = dynamic(
  () =>
    import('@features/unlock/shopify').then((mod) => mod.OffKeyHeaderConnected),
  { ssr: false },
);

export default async function Header({
  params: { locale, gateId, address },
}: HeaderProps) {
  const campaign = await getShopifyCampaignParametersForConnected({
    gateId,
    locale,
  });
  if (!campaign) {
    notFound();
  }
  const headerConnectedTexts =
    campaign.shopifyCampaignTemplate.headerConnectedTexts;
  const headerProps = {
    organizerId: campaign.organizerId,
    textHeaderConnected: {
      default: headerConnectedTexts.titleDefault,
      howToGet: headerConnectedTexts.titleHowToGet,
    },
    locale,
  };
  const profileTexts = campaign.shopifyCampaignTemplate.profileTexts;
  const profileProps = {
    organizerId: campaign.organizerId,
    textProfile: {
      myAccount: profileTexts.menuSectionMyAccount,
      signOut: profileTexts.menuActionSignOut,
    },
    locale,
  };
  return (
    <OffKeyHeaderConnected
      {...headerProps}
      viewType={OffKeyViewHeaderConnected.Default}
      profile={<OffKeyProfile {...profileProps} user={{ id: '', address }} />}
    />
  );
}
