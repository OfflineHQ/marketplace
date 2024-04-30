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
  const props = {
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
  return <OffKeyGate className="flex-1 pt-2" {...props} />;
}
