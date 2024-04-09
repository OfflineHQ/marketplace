import { Text } from '@ui/components';
import { useTranslations } from 'next-intl';

export interface OffKeyGateSignInProps {
  gateId: string;
}

export function OffKeyGateSignIn({ gateId }: OffKeyGateSignInProps) {
  const t = useTranslations('Shopify.OffKeyAuth');
  return <Text className="px-2 pt-1.5">{t('gate-sign-in-text')}</Text>;
}
