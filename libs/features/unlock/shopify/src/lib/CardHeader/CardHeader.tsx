import { CardHeader, CardTitle, Text } from '@ui/components';
import { useTranslations } from 'next-intl';

export interface CardHeaderProps {
  profile?: React.ReactNode;
}
function ShopifyCardHeaderNotConnected() {
  const t = useTranslations('Shopify.CardHeader');
  return (
    <CardHeader>
      <CardTitle>{t('unlock-with-your-offkey-title')}</CardTitle>
      <Text>{t('unlock-with-your-offkey-description')}</Text>
    </CardHeader>
  );
}

function ShopifyCardHeaderConnected({ profile }: CardHeaderProps) {
  const t = useTranslations('Shopify.CardHeader');
  return <CardHeader className="flex justify-between">{profile}</CardHeader>;
}
export const ShopifyCardHeader: React.FC<CardHeaderProps> = ({ profile }) => {
  const t = useTranslations('Shopify.CardHeader');
  return (
    <CardHeader>
      {!profile ? (
        <ShopifyCardHeaderNotConnected />
      ) : (
        <ShopifyCardHeaderConnected profile={profile} />
      )}
    </CardHeader>
  );
};
