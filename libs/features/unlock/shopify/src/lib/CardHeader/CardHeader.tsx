import { CardHeader, CardTitle, CardDescription, Text } from '@ui/components';
import { useTranslations } from 'next-intl';
import { Key } from '@ui/icons';

export interface CardHeaderProps {
  profile?: React.ReactNode;
}
function ShopifyCardHeaderNotConnected() {
  const t = useTranslations('Shopify.CardHeader');
  return (
    <CardHeader>
      <CardTitle className="no-wrap flex flex-row items-center space-x-1">
        <span>{t('unlock-with-your-offkey-title')}</span>
        <Key flex size="lg" className="m-0" />
      </CardTitle>
      <CardDescription>
        {t('unlock-with-your-offkey-description')}
      </CardDescription>
    </CardHeader>
  );
}

function ShopifyCardHeaderConnected({ profile }: CardHeaderProps) {
  const t = useTranslations('Shopify.CardHeader');
  return (
    <CardHeader className="mt-0 flex-row items-center justify-between pl-3 pr-0 pt-0">
      <CardTitle className="mt-1.5">OFFLINE Wallet</CardTitle>
      {profile}
    </CardHeader>
  );
}
export const ShopifyCardHeader: React.FC<CardHeaderProps> = ({ profile }) => {
  const t = useTranslations('Shopify.CardHeader');
  return !profile ? (
    <ShopifyCardHeaderNotConnected />
  ) : (
    <ShopifyCardHeaderConnected profile={profile} />
  );
};
