import { LoyaltyCardPage } from '@features/back-office/loyalty-card';
import { getLoyaltyCardOrganizer } from '@features/back-office/loyalty-card-api';
import { type Locale } from '@next/i18n';

interface LoyaltyCardProps {
  params: {
    locale: Locale;
  };
}

export default async function LoyaltyCard({
  params: { locale },
}: LoyaltyCardProps) {
  const loyaltyCard = await getLoyaltyCardOrganizer();
  return <LoyaltyCardPage loyaltyCard={loyaltyCard} />;
}
