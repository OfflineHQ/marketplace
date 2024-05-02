import {
  OffKeyLayout,
  OffKeyViewHeaderConnected,
} from '@features/unlock/shopify';
import { getShopifyCampaignParametersForConnected } from '@features/unlock/shopify-api';
import { Locale } from '@gql/shared/types';
import { OffKeyState } from '@next/iframe';
import dynamic from 'next/dynamic';
import { notFound } from 'next/navigation';

interface GateProps {
  params: {
    locale: Locale;
    gateId: string;
    address: string;
  };
}

const OffKeyGate = dynamic(
  () => import('@features/unlock/shopify').then((mod) => mod.OffKeyGate),
  { ssr: false },
);

const OffKeyProfile = dynamic(
  () => import('@features/unlock/shopify').then((mod) => mod.OffKeyProfile),
  { ssr: false },
);
const OffKeyHeaderConnected = dynamic(
  () =>
    import('@features/unlock/shopify').then((mod) => mod.OffKeyHeaderConnected),
  { ssr: false },
);

export default async function Gate({
  params: { locale, gateId, address },
}: GateProps) {
  const campaign = await getShopifyCampaignParametersForConnected({
    gateId,
    locale,
  });
  if (!campaign) {
    notFound();
  }
  const gateConnectedTexts =
    campaign.shopifyCampaignTemplate.gateConnectedTexts;
  const gateProps = {
    organizerId: campaign.organizerId,
    textGate: {
      subtitle: {
        [OffKeyState.Unlocked]: gateConnectedTexts.subtitleUnlocked,
        [OffKeyState.Unlocking]: gateConnectedTexts.subtitleUnlocking,
        [OffKeyState.Used]: gateConnectedTexts.subtitleUsed,
        [OffKeyState.Locked]: gateConnectedTexts.subtitleLocked,
      },
      mainText: {
        [OffKeyState.Unlocked]: gateConnectedTexts.paragraphUnlocked,
        [OffKeyState.Unlocking]: gateConnectedTexts.paragraphUnlocking,
        [OffKeyState.Used]: gateConnectedTexts.paragraphUsed,
        [OffKeyState.Locked]: gateConnectedTexts.paragraphLocked,
      },
      key: {
        statusText: {
          [OffKeyState.Unlocked]: gateConnectedTexts.gateStatus.unlocked,
          [OffKeyState.Unlocking]: gateConnectedTexts.gateStatus.unlocking,
          [OffKeyState.Used]: gateConnectedTexts.gateStatus.used,
          [OffKeyState.Locked]: gateConnectedTexts.gateStatus.locked,
        },
        name: gateConnectedTexts.gateStatus.name,
      },
    },
    locale,
  };
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
    <OffKeyLayout
      header={
        <OffKeyHeaderConnected
          {...headerProps}
          viewType={OffKeyViewHeaderConnected.Default}
          profile={
            <OffKeyProfile {...profileProps} user={{ id: '', address }} />
          }
        />
      }
    >
      <OffKeyGate className="flex-1 pt-2" {...gateProps} />
    </OffKeyLayout>
  );
}
